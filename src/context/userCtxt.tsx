import React, { createContext, useState, ReactNode } from "react";
import { ContextProps } from "../types/contextTypes";

const UserCtxt = createContext({} as ContextProps);

export const UserProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [sysNotif, setSysNotif] = useState({
    show: false,
    title: "",
    text: "",
    color: "",
    hasCancel: false,
    actions: [{ text: "", func: () => {} }],
  });

  return (
    <UserCtxt.Provider value={{ sysNotif, setSysNotif }}>
      {children}
    </UserCtxt.Provider>
  );
};

export default UserCtxt;
