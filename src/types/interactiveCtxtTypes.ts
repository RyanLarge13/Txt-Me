import { Dispatch, ReactElement, SetStateAction } from "react";

export type MenuTitle = {
  string: string;
  icon: ReactElement;
};

export type SettingsState = {
  page: string;
};

export type ContextMenuOptions = {
  txt: string;
  func: () => void;
};

export type ContextMenuShowType = {
  show: boolean;
  title: string;
  color: string;
  coords: { x: number; y: number };
  mainOptions: ContextMenuOptions[];
  options: ContextMenuOptions[];
};

export interface InteractiveCtxtTypes {
  setOpenChatsMenu: Dispatch<SetStateAction<boolean>>;
  setNewChat: Dispatch<SetStateAction<boolean>>;
  setTitle: Dispatch<SetStateAction<MenuTitle>>;
  setSettingsState: Dispatch<SetStateAction<SettingsState>>;
  setContextMenuShow: Dispatch<SetStateAction<ContextMenuShowType>>;
  contextMenuShow: ContextMenuShowType;
  settingsState: SettingsState;
  title: MenuTitle;
  newChat: boolean;
  openChatsMenu: boolean;
}
