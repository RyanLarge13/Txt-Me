import { AxiosResponse } from "axios";
import React, { createContext, ReactNode, useEffect, useState } from "react";

import useLocalStorage from "../hooks/useLocalStorage.ts";
import {
  Contacts,
  MessageSession,
  User,
  UserProps,
} from "../types/userTypes.ts";
import { fetchUserData, getContacts } from "../utils/api.ts";

const UserCtxt = createContext({} as UserProps);

export const UserProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  // State and state hooks --------------------------------------------------------------
  // Local storage items and their state
  const [token, tokenFailed, setToken] = useLocalStorage<string>("authToken");
  const [user, userFailed, setUser] = useLocalStorage<User>("user");

  // State
  const [openChatsMenu, setOpenChatsMenu] = useState(false);
  const [newChat, setNewChat] = useState(false);
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
      getUserContacts(token);
      getUserData(token);
    }
  }, [token]);

  useEffect(() => {
    // Listen for local storage parsing or fetching errors
    // if (userFailed || tokenFailed) {
    //   console.error(
    //     "Failed to grab user or token from storage or no value was present"
    //   );
    //   console.log(
    //     `Error messages for user or token information failure: ${
    //       userFailed
    //         ? userFailed.message
    //         : tokenFailed
    //         ? tokenFailed.message
    //         : "No errors present"
    //     }`
    //   );
    // }
  }, [tokenFailed, userFailed]);
  // useEffect hooks -------------------------------------------------------------------

  // Local Scope Context Functions ---------------------------------------------------
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
        token,
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
        setToken,
        setUser,
      }}
    >
      {children}
    </UserCtxt.Provider>
  );
};

export default UserCtxt;
