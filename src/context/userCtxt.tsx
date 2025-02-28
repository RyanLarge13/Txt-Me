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
import React, { createContext, ReactNode, useEffect, useState } from "react";

import useLogger from "../hooks/useLogger.ts";
import { Contacts, MessageSession, UserCtxtProps } from "../types/userTypes.ts";
import { fetchUserData } from "../utils/api.ts";
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

  const [contacts, setContacts] = useState<Contacts[] | []>([]);
  const [allMessages, setAllMessages] = useState(new Map());
  const [messageSession, setMessageSession] = useState<MessageSession | null>(
    null
  );
  // State and state hooks --------------------------------------------------------------

  // useEffect hooks -------------------------------------------------------------------
  useEffect(() => {
    // Fetch user data and contacts to update
    if (token) {
      log.devLog(
        "Fetching user data and initializing app from cache (indexedDB), authToken present"
      );

      fetchLocalMessagesAndContacts();
      fetchNetworkMessagesAndContacts();
      // getUserData(user.authToken);
    } else {
      log.devLog("Skipping fetch, no auth token present. User must login");
    }
  }, [token]);
  // useEffect hooks -------------------------------------------------------------------

  // Local Scope Context Functions ---------------------------------------------------

  const fetchLocalMessagesAndContacts = async () => {
    const messages = await getMessagesData();
    const contacts = await getContactsData();

    log.devLog("Messages and contacts data from IndexedDB", messages, contacts);
  };

  const fetchNetworkMessagesAndContacts = async () => {
    try {
      const userDataResponse: AxiosResponse = await fetchUserData(token);
      log.devLog("Fetched user data from server", userDataResponse);
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
