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
  number,
  { contact: Contacts; messages: Message[] }
>;

export type Contacts = {
  address: string;
  avatar: null | string;
  contactid: number;
  createdat: string;
  email: string;
  name: string;
  nickname: string;
  number: number;
  space: string;
  userid: string;
  website: string;
};

export type Message = {
  fromid: string | undefined;
  message: string;
  time: Date;
};

export type MessageSession = {
  number: number;
  messages: Message[];
  contact: Contacts;
};

export interface UserCtxtProps {
  setContacts: Dispatch<SetStateAction<Contacts[] | []>>;
  setMessageSession: Dispatch<SetStateAction<MessageSession | null>>;
  setAllMessages: Dispatch<SetStateAction<Map<number, Message[]>>>;
  contacts: Contacts[] | [];
  messageSession: MessageSession | null;
  allMessages: AllMessages;
}
