import React, { createContext, useState, ReactNode, useEffect } from "react";
import {
  Contacts,
  MessageSession,
  UserProps,
  User,
} from "../types/userTypes.ts";
import { fetchUserData, getContacts } from "../utils/api.ts";
import { AxiosResponse } from "axios";
import DBManager from "../utils/IndexDB.ts";
import NotifHdlr from "../utils/NotifHdlr.ts";
import useLocalStorage from "../hooks/useLocalStorage.ts";

const UserCtxt = createContext({} as UserProps);

export const UserProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [token, tokenFailed, setToken] = useLocalStorage<string>("authToken");
  const [user, userFailed, setUser] = useLocalStorage<User>("user");
  const [preferences, failedPreferences, setPreferences] =
    useLocalStorage("preferences");

  const [openChatsMenu, setOpenChatsMenu] = useState(false);
  const [newChat, setNewChat] = useState(false);
  const [contacts, setContacts] = useState<Contacts[] | []>([]);
  const [messageSession, setMessageSession] = useState<MessageSession | null>(
    null
  );
  const [allMessages, setAllMessages] = useState(new Map());
  const [sysNotif, setSysNotif] = useState({
    show: false,
    title: "",
    text: "",
    color: "",
    hasCancel: false,
    actions: [{ text: "", func: (): void => {} }],
  });

  useEffect(() => {
    if (token) {
      getContacts(token)
        .then((res) => {
          console.log(res);
          setContacts(res.data.data.contacts);
        })
        .catch((err) => {
          console.log(err);
          notifHdlr.setNotif(
            "Error",
            "We could not update your contacts",
            false,
            []
          );
        });
      fetchUserData(token)
        .then((res: AxiosResponse): void => {
          setUser(res.data.data.user);
        })
        .catch((err) => {
          console.log(err);
          setToken("null");
          notifHdlr.setNotif(
            "Error",
            "Please login again to access your account",
            false,
            []
          );
        });
    }
  }, [token]);

  const notifHdlr = new NotifHdlr(setSysNotif);
  const userDb = new DBManager();

  return (
    <UserCtxt.Provider
      value={{
        sysNotif,
        notifHdlr,
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
        setSysNotif,
        setToken,
        setUser,
      }}
    >
      {children}
    </UserCtxt.Provider>
  );
};

export default UserCtxt;
