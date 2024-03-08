import React, { createContext, useState, ReactNode } from "react";
import { ContextProps } from "../types/contextTypes";
import NotifHdlr from "../utils/NotifHdlr.ts";

const UserCtxt = createContext({} as ContextProps);

export const UserProvider = ({
 children
}: {
 children: ReactNode;
}): JSX.Element => {
 const [sysNotif, setSysNotif] = useState({
  show: false,
  title: "",
  text: "",
  color: "",
  hasCancel: false,
  actions: [{ text: "", func: () => {} }]
 });

 const [token, setToken] = useState("");

 const notifHdlr = new NotifHdlr(setSysNotif);

 return (
  <UserCtxt.Provider value={{ sysNotif, setSysNotif, notifHdlr, token, setToken}}>
   {children}
  </UserCtxt.Provider>
 );
};

export default UserCtxt;
