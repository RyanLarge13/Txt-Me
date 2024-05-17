import React, { createContext, useState, ReactNode, useEffect } from "react";
import { ContextProps } from "../types/contextTypes";
import { fetchUserData } from "../utils/api.ts";
import NotifHdlr from "../utils/NotifHdlr.ts";

const UserCtxt = createContext({} as ContextProps);

export const UserProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [token, setToken] = useState("");
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
        .then((res) => {
          setUser(res.data.data.user);
        })
        .catch((err) => {
          console.log(err);
          setToken("");
          localStorage.removeItem("authToken");
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
        setSysNotif,
        notifHdlr,
        token,
        setToken,
        user,
        setUser,
      }}
    >
      {children}
    </UserCtxt.Provider>
  );
};

export default UserCtxt;
