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
  AllMessages,
  Contacts,
  Message,
  MessageSessionType,
  UserCtxtProps,
} from "../types/userTypes.ts";
import { API_FetchUserData } from "../utils/api.ts";
import { useConfig } from "./configContext.tsx";
import { useDatabase } from "./dbContext.tsx";

const UserCtxt = createContext({} as UserCtxtProps);

export const UserProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  // State and state hooks --------------------------------------------------------------
  const { getContactsData, getMessagesData } = useDatabase();
  const { getUserData } = useConfig();
  const log = useLogger();

  const token = getUserData("authToken");

  const [contacts, setContacts] = useState<Contacts[]>([]);
  const [allMessages, setAllMessages] = useState(new Map());
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
      M_FetchNetworkMessagesAndContacts();
    } else {
      log.devLog("Skipping fetch, no auth token present. User must login");
    }
  }, [token]);
  // useEffect hooks -------------------------------------------------------------------

  // Local Scope Context Functions ---------------------------------------------------

  const M_BuildMessagesMap = (
    messages: Message[],
    contacts: Contacts[]
  ): void => {
    const newMap: AllMessages = new Map();

    messages.forEach((m: Message) => {
      if (!newMap.has(m.fromnumber)) {
        const contact = contacts.find((c) => c.number === m.fromnumber);

        if (!contact) {
          log.devLog(
            "No contact in the db from this number when building message map",
            contact,
            `Number: ${m.fromnumber}`
          );
        }

        newMap.set(m.fromnumber, {
          contact: contact || null,
          messages: [m],
        });
      } else {
        newMap.get(m.fromnumber)?.messages.push(m);
      }
    });

    setAllMessages(newMap);
  };

  const M_FetchLocalMessagesAndContacts = async () => {
    const messages: Message[] = (await getMessagesData()) || [];
    const contacts: Contacts[] = (await getContactsData()) || [];

    log.devLog("Messages and contacts data from IndexedDB", messages, contacts);

    // Add messages and contact to state
    setContacts(contacts);
    M_BuildMessagesMap(messages, contacts);
  };

  const M_FetchNetworkMessagesAndContacts = async () => {
    try {
      const userDataResponse: AxiosResponse = await API_FetchUserData(token);
      log.devLog("Fetched user data from server", userDataResponse);

      // Update the Local Database
      // Update app state
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
