import React, { createContext, ReactNode, useState } from "react";

import { NotifCtxtProps } from "../types/notifTypes.ts";

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

  return (
    <NotifCtxt.Provider
      value={{
        sysNotif,
        setSysNotif,
      }}
    >
      {children}
    </NotifCtxt.Provider>
  );
};

export default NotifCtxt;
