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

import { ContactType } from "./contactTypes";
import { MessageSessionMapType, MessageSessionType } from "./messageTypes";

export interface UserCtxtProps {
  setContacts: Dispatch<SetStateAction<ContactType[] | []>>;
  setMessageSession: Dispatch<SetStateAction<MessageSessionType | null>>;
  setMessageSessionsMap: Dispatch<SetStateAction<MessageSessionMapType>>;
  contacts: ContactType[] | [];
  messageSession: MessageSessionType | null;
  messageSessionsMap: MessageSessionMapType;
}
