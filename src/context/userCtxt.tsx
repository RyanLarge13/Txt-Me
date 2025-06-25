/*
Txt Me - A web based messaging platform
Copyright (C) 2025 Ryan Large

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import { AxiosResponse } from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";

import useLogger from "../hooks/useLogger.ts";
import {
    AllMessages, Contacts, Message, MessageSessionType, UserCtxtProps
} from "../types/userTypes.ts";
import { API_FetchUserData, API_GetContacts } from "../utils/api.ts";
import { tryCatch } from "../utils/helpers.ts";
import { valPhoneNumber } from "../utils/validator.ts";
import { useConfig } from "./configContext.tsx";
import { useDatabase } from "./dbContext.tsx";

const UserCtxt = createContext({} as UserCtxtProps);

export const UserProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  // State and state hooks --------------------------------------------------------------
  const {
    IDB_GetContactsData,
    IDB_GetMessagesData,
    IDB_GetMessageSessions,
    IDB_AddContact,
    IDB_GetLastMessageSession,
  } = useDatabase();
  const { getUserData } = useConfig();
  const log = useLogger();

  const token: string = getUserData("authToken");

  /*
    NOTE:
      Commented out below because it was part of the old build messages
      map method
  */
  // const myPhoneNumber: string = getUserData("phoneNumber");

  const [contacts, setContacts] = useState<Contacts[]>([]);
  const [allMessages, setAllMessages] = useState<AllMessages>(new Map());
  const [messageSession, setMessageSession] =
    useState<MessageSessionType | null>(null);
  // State and state hooks --------------------------------------------------------------

  // useEffect hooks -------------------------------------------------------------------
  useEffect(() => {
    // Fetch user data and contacts to update
    if (token) {
      log.devLog(
        "Fetching user data and initializing app from cache (indexedDB), authToken present"
      );

      M_FetchLocalMessagesAndContacts();
      M_FetchStoredSession();
      M_FetchNetworkMessagesAndContacts();
    } else {
      log.devLog("Skipping fetch, no auth token present. User must login");
    }
  }, [token]);
  // useEffect hooks -------------------------------------------------------------------

  // Local Scope Context Functions ---------------------------------------------------

  /*
      NOTE:
        Commenting out build messages map method for now to try the new map build method
    */
  // const M_BuildMessagesMap = (
  //   messages: Message[],
  //   dbContacts: Contacts[]
  // ): void => {
  //   const newMap: AllMessages = new Map();

  //   log.devLog(
  //     "In build message map. User Context. Messages: ",
  //     messages,
  //     "Contacts: ",
  //     dbContacts
  //   );

  //   messages.forEach(async (m: Message) => {
  //     // Look for both to and from number. Incase the way the message was stored?? Not sure if this is necessary
  //     const contact = dbContacts.find(
  //       (c) => c.number === m.fromnumber || c.number === m.tonumber
  //     );

  //     /*
  //       TODO:
  //         IMPLEMENT:
  //           1. Clean this up. Not so many if / else blocks
  //     */
  //     if (!contact) {
  //       log.logAllError(
  //         "No contact in the db from this number when building message map. Check server",
  //         contact,
  //         `Number: ${m.fromnumber}`
  //       );
  //     }

  //     // Phone number for user MUST be present
  //     if (!myPhoneNumber || myPhoneNumber === "") {
  //       log.logAllError(
  //         "No stored phone number present for the user, cannot compare message with stored number. Users phone number: ",
  //         myPhoneNumber
  //       );

  //       throw new Error(
  //         "No phone number present for user. Check server and how you are storing the phone number"
  //       );
  //     }

  //     // Check for the phone number possibly being the current users
  //     const targetNumber =
  //       m.fromnumber === myPhoneNumber ? m.tonumber : m.fromnumber;

  //     let newAESKey: CryptoKey | null = null;

  //     try {
  //       newAESKey = await Crypto_GenAESKey();
  //     } catch (err) {
  //       throw new Error(
  //         "Error generating AES key! Check method and caller of the method Crypto_GenAESKey"
  //       );
  //     }

  //     if (!newMap.has(targetNumber)) {
  //       newMap.set(targetNumber, {
  //         contact: contact || null,
  //         messages: [m],
  //         AESKey: newAESKey,
  //       });
  //     } else {
  //       newMap.get(targetNumber)?.messages.push(m);
  //     }
  //   });

  //   log.devLog("Map after building it with available data", newMap);
  //   setAllMessages(newMap);
  // };

  /*
    NOTE:
      This is the new messages map build function for now
  */
  const M_BuildMessagesMap = async (): Promise<void> => {
    const { data: dbMessageSessions, error: messageSessionQueryErr } =
      await tryCatch<[string, MessageSessionType][]>(
        IDB_GetMessageSessions,
        "Error when pulling message sessions array from IndexedDB inside M_BuildMEssagesMap (new)"
      );

    if (messageSessionQueryErr || !dbMessageSessions) {
      log.logAllError(messageSessionQueryErr);
      return;
    }

    if (dbMessageSessions.length < 1) {
      return;
    }

    const { data: newMessageSessionMap, error: mapCreationError } =
      await tryCatch<AllMessages>(
        () => new Map(dbMessageSessions),
        "Error creating new map from IndexedDB fetched message session array"
      );

    if (mapCreationError || !newMessageSessionMap) {
      log.logAllError(mapCreationError);
      return;
    }

    setAllMessages(newMessageSessionMap);
  };

  const M_AddServerMessagesToMap = (serverMessages: Message[]) => {
    log.devLog("Messages from server: ", serverMessages);

    /*
      TODO:
        NOTE: 
          1. Might not build out this function. 
          Turn it into a synchronization method instead that 
          will run in the background service worker? 
        CONSIDER:
          1. Only grab messages that don't exist yet on the client. 
          Implement tracking system? 
    */
  };

  const M_FetchLatestContacts = async (): Promise<void> => {
    try {
      const response = await API_GetContacts(token);

      let serverContacts = response.data?.data?.contacts;

      if (!serverContacts) {
        log.logAllError(
          "Error. Check response object. Check server to see why it is not returning at least an empty array",
          response
        );

        serverContacts = [];
      }

      // Handle any deletion or additions to contacts
      // Possibly need to implement a tracking system to make
      // sure that users devices stay correctly synced
      /*
        NOTE:
          1. Uncomment out below if you want to set contacts to that which is
          stored in the DB and returned form the server. Will not contain
          any local changes made with IndexedDB without network
      */
      // setContacts(serverContacts);
      // For now just add what contacts you get back from the server into the local DB
      try {
        serverContacts.forEach(async (c: Contacts) => {
          log.devLog("Adding contact from server to the local IDB database");
          await IDB_AddContact(c);
        });

        const localContacts = await IDB_GetContactsData();

        setContacts(localContacts);
      } catch (err) {
        log.logError(
          "Error adding contacts from server to the local database.",
          err
        );
      }
    } catch (err) {
      log.logAllError("Failed to fetch contacts from server", err);
    }
  };

  const M_FetchLatestMessages = async () => {
    try {
      /*
        TODO:
          NOTE: 
            1. Commenting out network request until tracking system is in place
      */
      // const response = await API_GetMessages(token);

      // let serverMessages = response.data?.data?.messages;
      let serverMessages: Message[] = [];

      if (!serverMessages) {
        log.logAllError(
          "Error. check response object. Also check server getMessages control method. Sending back no data for messages"
          // response
        );

        serverMessages = [];
      }

      M_AddServerMessagesToMap(serverMessages);
    } catch (err) {
      log.logAllError(
        "Error from the server when fetching latest messages from userCtxt.tsx",
        err
      );
    }
  };

  const M_FetchLocalMessagesAndContacts = async (): Promise<void> => {
    const messages: Message[] = (await IDB_GetMessagesData()) || [];
    const dbContacts: Contacts[] = (await IDB_GetContactsData()) || [];

    log.devLog(
      "Messages and contacts data from IndexedDB",
      messages,
      dbContacts
    );

    // Add messages and contact to state
    setContacts(dbContacts);

    /*
      NOTE:
        Commenting out build messages map method for now to try the new map build method
    */
    // M_BuildMessagesMap(messages, dbContacts);

    /*
      NOTE:
        Below is the new messages map method
    */
    M_BuildMessagesMap();
  };

  const M_FetchStoredSession = async (): Promise<void> => {
    try {
      const lastSession = await IDB_GetLastMessageSession();

      if (!lastSession) {
        throw new Error("Message session from IndexDB returned undefined");
      }

      if (lastSession.number === "-1") {
        return;
      }

      if (!valPhoneNumber(lastSession.number)) {
        throw new Error(
          `When pulling stored message session from indexedDB, lastSession.number returned an invalid number. Number: ${lastSession.number}`
        );
      }

      setMessageSession(lastSession);
    } catch (err) {
      log.logAllError(
        "Error fetching stored message session from IndexedDB",
        err
      );
    }
  };

  const M_FetchNetworkMessagesAndContacts = async (): Promise<void> => {
    // This local try catch block catches the main userDataResponse. Not contacts and
    // messages fetch
    try {
      const userDataResponse: AxiosResponse = await API_FetchUserData(token);
      log.devLog("Fetched user data from server", userDataResponse);

      /*
        TODO:
          CONSIDER:
            1. Should I call these and return the server data here to update app state 
            and DB state within this method for latest contacts and latest messages or no? 
      */
      await M_FetchLatestContacts();
      await M_FetchLatestMessages();

      /*
        TODO:
          IMPLEMENT:
            1. Fetch unsynced contacts here to make sure the remote db
            gets the latest data. Verify contacts are of correct datatype
            first and that the only good reason for it not to be synced is
            because of network errors and such when the contact was created
      */
      // const unsyncedContacts = await IDB_FetchUnsyncedContacts();
    } catch (err) {
      log.logAllError("Error when fetching user data", err);
    }
  };

  // Local Scope Context Functions --------------------------------------------------

  return (
    <UserCtxt.Provider
      // Please keep static state on top half and set state hooks on lower half
      value={{
        contacts,
        messageSession,
        allMessages,
        setAllMessages,
        setMessageSession,
        setContacts,
      }}
    >
      {children}
    </UserCtxt.Provider>
  );
};

export default UserCtxt;
