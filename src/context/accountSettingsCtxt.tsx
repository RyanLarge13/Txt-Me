import React, { createContext, useState, ReactNode } from "react";
import { MdAccountCircle } from "react-icons/md";
const AccountSettingsCtxt = createContext({} /*as SocketProps*/);

export const AccountSettingsProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [title, setTitle] = useState({
    string: "Account",
    icon: <MdAccountCircle />,
  });
  const [settingsState, setSettingsState] = useState({ page: "main" });

  return (
    <AccountSettingsCtxt.Provider
      value={{
        title,
        settingsState,
        setSettingsState,
        setTitle,
      }}
    >
      {children}
    </AccountSettingsCtxt.Provider>
  );
};

export default AccountSettingsCtxt;
