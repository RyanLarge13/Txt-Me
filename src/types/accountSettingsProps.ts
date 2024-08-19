import { Dispatch, SetStateAction } from "react";

export type Title = {
  string: string;
  icon: React.ReactNode;
};

export type SettingsState = {
  page: string;
};

export interface AccountSettingsProps {
  setTitle: Dispatch<SetStateAction<Title>>;
  setSettingsState: Dispatch<SetStateAction<SettingsState>>;
  title: Title;
  settingsState: SettingsState;
}
