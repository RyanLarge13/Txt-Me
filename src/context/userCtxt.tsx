/*
Txt Me - A learn to draw program
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
import { Contacts, MessageSession, UserProps } from "../types/userTypes.ts";
import { fetchUserData, getContacts } from "../utils/api.ts";
import { useDatabase } from "./dbContext.tsx";

const UserCtxt = createContext({} as UserProps);

export const UserProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  // State and state hooks --------------------------------------------------------------
  const { getAppUserData } = useDatabase();

  // State
  const [user, setUser] = useState({
    userId: 0,
    authToken: "",
    username: "",
    email: "",
    phoneNumber: "",
  });
  const [openChatsMenu, setOpenChatsMenu] = useState(false);
  const [newChat, setNewChat] = useState(false);
  const [contacts, setContacts] = useState<Contacts[] | []>([]);
  const [allMessages, setAllMessages] = useState(new Map());
  const [messageSession, setMessageSession] = useState<MessageSession | null>(
    null
  );
  // State and state hooks --------------------------------------------------------------

  const log = useLogger();

  // useEffect hooks -------------------------------------------------------------------
  useEffect(() => {
    fetchLocalUser();
  }, []);

  useEffect(() => {
    // Fetch user data and contacts to update
    if (user.authToken) {
      getUserContacts(user.authToken);
      getUserData(user.authToken);
    }
  }, [user]);
  // useEffect hooks -------------------------------------------------------------------

  // Local Scope Context Functions ---------------------------------------------------
  const fetchLocalUser = async () => {
    const user = await getAppUserData();
    log.devLog(user);

    if (user) {
      setUser(user);
    }
  };

  const getUserContacts = async (token: string): Promise<void> => {
    try {
      const contactsResponse: AxiosResponse = await getContacts(token);
      setContacts(contactsResponse.data.data.contacts);
    } catch (err) {
      console.log(`Error when fetching users contacts. Error: ${err}`);
    }
  };

  const getUserData = async (token: string): Promise<void> => {
    try {
      const userDataResponse: AxiosResponse = await fetchUserData(token);
      setUser(userDataResponse.data.data.user);
    } catch (err) {
      console.log(`Error when fetching user data. Error: ${err}`);
    }
  };
  // Local Scope Context Functions --------------------------------------------------

  return (
    <UserCtxt.Provider
      // Please keep static state on top half and set state hooks on lower half
      value={{
        user,
        openChatsMenu,
        newChat,
        contacts,
        messageSession,
        allMessages,
        setAllMessages,
        setMessageSession,
        setContacts,
        setNewChat,
        setOpenChatsMenu,
        setUser,
      }}
    >
      {children}
    </UserCtxt.Provider>
  );
};

export default UserCtxt;
