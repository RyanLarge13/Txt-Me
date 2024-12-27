import React, { createContext, useState, ReactNode } from "react";
import { NotifCtxtProps } from "../types/userTypes.ts";
import NotifHdlr from "../utils/NotifHdlr.ts";

const NotifCtxt = createContext({} as NotifCtxtProps);

export const NotifProvider = ({
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
    actions: [{ text: "", func: (): void => {} }],
  });

  const notifHdlr = new NotifHdlr(setSysNotif);

  return (
    <NotifCtxt.Provider
      value={{
        notifHdlr,
      }}
    >
      {children}
    </NotifCtxt.Provider>
  );
};

export default NotifCtxt;
