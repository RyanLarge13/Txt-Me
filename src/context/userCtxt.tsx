import React, { createContext, useState, ReactNode, useEffect } from "react";
import { ContextProps } from "../types/contextTypes";
import { fetchUserData } from "../utils/api.ts";
import NotifHdlr from "../utils/NotifHdlr.ts";
import { AxiosResponse } from "axios";

const UserCtxt = createContext({} as ContextProps);

export const UserProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [token, setToken] = useState("");
  const [openChatsMenu, setOpenChatsMenu] = useState(false);
  const [newChat, setNewChat] = useState(false);
  const [sysNotif, setSysNotif] = useState({
    show: false,
    title: "",
    text: "",
    color: "",
    hasCancel: false,
    actions: [{ text: "", func: () => {} }],
  });
  const [user, setUser] = useState({
    username: "",
    userId: 0,
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken !== null && typeof token === "string") {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserData(token)
        .then((res: AxiosResponse): void => {
          setUser(res.data.data.user);
        })
        .catch((err) => {
          console.log(err);
          setToken("");
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

  return (
    <UserCtxt.Provider
      value={{
        sysNotif,
        notifHdlr,
        token,
        user,
        openChatsMenu,
        newChat,
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
