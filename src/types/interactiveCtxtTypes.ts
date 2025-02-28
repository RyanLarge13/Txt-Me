import { Dispatch, ReactElement, SetStateAction } from "react";

export type MenuTitle = {
  string: string;
  icon: ReactElement;
};

export type SettingsState = {
  page: string;
};

export interface InteractiveCtxtTypes {
  setOpenChatsMenu: Dispatch<SetStateAction<boolean>>;
  setNewChat: Dispatch<SetStateAction<boolean>>;
  setTitle: Dispatch<SetStateAction<MenuTitle>>;
  setSettingsState: Dispatch<SetStateAction<SettingsState>>;
  settingsState: SettingsState;
  title: MenuTitle;
  newChat: boolean;
  openChatsMenu: boolean;
}
