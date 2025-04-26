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
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import useLogger from "../hooks/useLogger.ts";
import {
  AllMessages,
  Contacts,
  Message,
  MessageSessionType,
  UserCtxtProps,
} from "../types/userTypes.ts";
import { API_FetchUserData, API_GetContacts } from "../utils/api.ts";
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
    getContactsData,
    getMessagesData,
    IDB_AddContact,
    IDB_GetLastMessageSession,
  } = useDatabase();
  const { getUserData } = useConfig();
  const log = useLogger();

  const token = getUserData("authToken");
  const myPhoneNumber = getUserData("phoneNumber");

  const [contacts, setContacts] = useState<Contacts[]>([]);
  const [allMessages, setAllMessages] = useState(new Map());
  const [messageSession, setMessageSession] =
    useState<MessageSessionType | null>(null);
  // State and state hooks --------------------------------------------------------------

  // useEffect hooks -------------------------------------------------------------------
  useEffect(() => {
    log.devLog(
      "Decoy useEffect to see if this context is being rerendered unnecessarily"
    );
  }, []);

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

  const M_BuildMessagesMap = (
    messages: Message[],
    dbContacts: Contacts[]
  ): void => {
    const newMap: AllMessages = new Map();

    log.devLog(
      "In build message map. User Context. Messages: ",
      messages,
      "Contacts: ",
      dbContacts
    );

    messages.forEach((m: Message) => {
      // Look for both to and from number. Incase the way the message was stored?? Not sure if this is necessary
      const contact = dbContacts.find(
        (c) => c.number === m.fromnumber || c.number === m.tonumber
      );

      /*
        TODO:
          IMPLEMENT:
            1. Clean this up. Not so many if / else blocks
      */
      if (!contact) {
        log.logAllError(
          "No contact in the db from this number when building message map. Check server",
          contact,
          `Number: ${m.fromnumber}`
        );
      }

      // Phone number for user MUST be present
      if (!myPhoneNumber || myPhoneNumber === "") {
        log.logAllError(
          "No stored phone number present for the user, cannot compare message with stored number. Users phone number: ",
          myPhoneNumber
        );

        throw new Error(
          "No phone number present for user. Check server and how you are storing the phone number"
        );
      }

      // Check for the phone number possibly being the current users
      const targetNumber =
        m.fromnumber === myPhoneNumber ? m.tonumber : m.fromnumber;

      if (!newMap.has(targetNumber)) {
        newMap.set(targetNumber, {
          contact: contact || null,
          messages: [m],
        });
      } else {
        newMap.get(targetNumber)?.messages.push(m);
      }
    });

    log.devLog("Map after building it with available data", newMap);
    setAllMessages(newMap);
  };

  const M_FetchLatestContacts = async (): Promise<void> => {
    try {
      const response = await API_GetContacts(token);

      const serverContacts = response.data?.data?.contacts || [];

      // Handle any deletion or additions to contacts
      // Possibly need to implement a tracking system to make
      // sure that users devices stay correctly synced
      setContacts(serverContacts);
      // For now just add what contacts you get back from the server into the local DB
      try {
        serverContacts.forEach(async (c: Contacts) => {
          log.devLog("Adding contact from server to the local IDB database");
          await IDB_AddContact(c);
        });
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
      // Why is this commented out?
      // const response = await API_GetMessages(token);
      // log.devLog(response);
      log.devLog(
        "Well, going to get messages from here at some point from the server"
      );
    } catch (err) {
      log.logAllError(
        "Error from the server when fetching latest messages from userCtxt.tsx",
        err
      );
    }
  };

  const M_FetchLocalMessagesAndContacts = async (): Promise<void> => {
    const messages: Message[] = (await getMessagesData()) || [];
    const dbContacts: Contacts[] = (await getContactsData()) || [];

    log.devLog(
      "Messages and contacts data from IndexedDB",
      messages,
      dbContacts
    );

    // Add messages and contact to state
    setContacts(dbContacts);
    M_BuildMessagesMap(messages, dbContacts);
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

      // Maybe let us perform a few more checks before continuing with setting
      // a message session to data we don't know is correct????!!!!!!!!!!!!!
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

      await M_FetchLatestContacts();
      await M_FetchLatestMessages();

      // setTimeout(() => {
      //   log.devLog("After timeout, here is the all messages map", allMessages);
      // }, 5000);

      // Update the Local Database
      // Update app state
    } catch (err) {
      log.logAllError("Error when fetching user data", err);
    }
  };

  // Local Scope Context Functions --------------------------------------------------

  // Getters ---------------------------------------
  const getAllMessages = useCallback(() => {
    return allMessages;
  }, [allMessages]);
  // Getters ---------------------------------------

  return (
    <UserCtxt.Provider
      // Please keep static state on top half and set state hooks on lower half
      value={{
        contacts,
        messageSession,
        allMessages,
        getAllMessages,
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
