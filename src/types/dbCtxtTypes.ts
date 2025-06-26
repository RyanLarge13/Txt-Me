import { IDBPDatabase } from "idb";

import { AppSettingsType, ThemeType, UserType } from "./appDataTypes";
import { ContactSettings, ContactType } from "./contactTypes";
import {
  MessageSessionType,
  MessageSettingsType,
  MessageType,
} from "./messageTypes";

export type DraftType = {
  contact: ContactType | null;
  messages: MessageType[];
};

export interface DBCtxtProps {
  IDB_GetMessageSessions: () => Promise<[string, MessageSessionType][]>;
  IDB_GetDB: () => Promise<IDBPDatabase>;
  IDB_GetDrafts: () => Promise<DraftType>;
  IDB_InitDatabase: (db: IDBPDatabase) => Promise<AppSettingsType>;
  IDB_GetAppUserData: () => Promise<UserType>;
  IDB_GetAppData: () => Promise<AppSettingsType>;
  IDB_GetThemeData: () => Promise<ThemeType[]>;
  IDB_GetMessagesData: () => Promise<MessageType[]>;
  IDB_GetContactsData: () => Promise<ContactType[]>;
  IDB_GetMessageSettingsData: () => Promise<MessageSettingsType[]>;
  IDB_GetContactSettingsData: () => Promise<ContactSettings[]>;
  IDB_GetPhoneNumber: () => Promise<string>;
  IDB_UpdateUserInDB: (user: UserType) => Promise<IDBValidKey>;
  IDB_UpdateContactInDraft: (contact: DraftType["contact"]) => Promise<void>;
  IDB_AddContact: (newContact: ContactType) => Promise<void>;
  IDB_UpdateMessageSession: (
    newSession: MessageSessionType | null
  ) => Promise<IDBValidKey>;
  IDB_GetLastMessageSession: () => Promise<MessageSessionType>;
  IDB_AddMessage: (newMessage: MessageType) => Promise<IDBValidKey>;
  IDB_UpdateContact: (newContact: ContactType) => Promise<void>;
  IDB_ClearContactDraft: () => Promise<void>;
  IDB_DeleteContact: (contactId: string) => Promise<void>;
  IDB_LogoutAndReset: () => Promise<void>;
  IDB_UpdateMessage: (message: MessageType) => Promise<void>;
  IDB_UpdateAppDataWebPush: (
    data: AppSettingsType["webPushSubscription"]
  ) => Promise<void>;
  IDB_UpdateMessages: (newMessages: MessageType[]) => Promise<void>;
  IDB_AppendMessages: (newMessages: MessageType[]) => Promise<void>;
  IDB_DeleteMessages: (messages: MessageType[]) => Promise<void>;
}
