/*
Txt Me - A web based messaging platform
Copyright (C) 2025 Ryan Large

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

export type SysNotifType = {
  id: string;
  confirmation: boolean;
  title: string;
  text: string;
  color: string;
  hasCancel: boolean;
  time: Date;
  actions: Actions[];
};

export type Actions = {
  text: string;
  func: () => void;
};

export interface NotifActionProps {
  addSuccessNotif: (
    title: string,
    text: string,
    hasCancel: boolean,
    actions: Actions[]
  ) => void;
  addErrorNotif: (
    title: string,
    text: string,
    hasCancel: boolean,
    actions: Actions[]
  ) => void;
  removeNotif: (id: string) => void;
  showNetworkErrorNotif: (actions: Actions[]) => void;
  clearAllNotifs: () => void;
  setStoredNotifs: Dispatch<SetStateAction<SysNotifType[]>>;
  handleAPIErrorNotif: (err: AxiosError) => void;
}

export interface NotifStateProps {
  notifs: SysNotifType[];
  storedNotifs: SysNotifType[];
}
