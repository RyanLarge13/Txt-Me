import { createContext, useState, ReactNode } from "react";
import { MdAccountCircle } from "react-icons/md";
import {
  AccountSettingsProps,
  SettingsState,
  Title,
} from "../types/accountSettingsProps";

const AccountSettingsCtxt = createContext({} as AccountSettingsProps);

export const AccountSettingsProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [title, setTitle] = useState<Title>({
    string: "Account",
    icon: <MdAccountCircle />,
  });
  const [settingsState, setSettingsState] = useState<SettingsState>({
    page: "main",
  });

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
