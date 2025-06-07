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

import { Dispatch, SetStateAction } from "react";

export type AllMessages = Map<
  string,
  { contact: Contacts | null; messages: Message[] }
>;

export type Contacts = {
  contactid: string;
  name: string;
  email: string;
  number: string;
  createdat: Date;
  space: string;
  nickname: string;
  address: string;
  website: string;
  avatar: null | string;
  synced: boolean;
};

export type Message = {
  messageid: number;
  message: string;
  sent: boolean;
  sentat: Date;
  delivered: boolean;
  deliveredat: Date | null;
  read: boolean;
  readat: Date | null;
  fromnumber: string;
  tonumber: string;
};

export type MessageSessionType = {
  number: string;
  messages: Message[];
  contact: Contacts | null;
};

export interface UserCtxtProps {
  setContacts: Dispatch<SetStateAction<Contacts[] | []>>;
  setMessageSession: Dispatch<SetStateAction<MessageSessionType | null>>;
  setAllMessages: Dispatch<SetStateAction<AllMessages>>;
  contacts: Contacts[] | [];
  messageSession: MessageSessionType | null;
  allMessages: AllMessages;
}
