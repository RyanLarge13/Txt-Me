import { IDBPDatabase } from "idb";

import { User } from "./configCtxtTypes";
import { Contacts, Message, MessageSessionType } from "./userTypes";

export type AppSettings = {
  initialized: boolean;
  authToken: string;
  locked: boolean;
  passwordType: string;
  showOnline: boolean;
};

export type DBUser = {
  userId: number;
  username: string;
  email: string;
  phoneNumber: string;
  authToken: string;
};

export type Theme = {
  darkMode: boolean;
  accent: string;
  background: string;
  animations: {
    speed: number;
    spring: boolean;
  };
};

export type MessageSettings = {
  showImg: boolean;
  showLatestMessage: boolean;
  showTimeOfLatestMessage: boolean;
  showHowManyUnread: boolean;
  sort: string;
  order: string;
  showYouAreTyping: boolean;
  showYouHaveRead: boolean;
};

export type ContactSettings = {
  showImage: boolean;
  showLatestMessages: boolean;
  showHowMayUnreadMessages: boolean;
  sort: string;
  order: string;
};

export interface DBCtxtProps {
  getDB: () => Promise<IDBPDatabase>;
  initDatabase: (db: IDBPDatabase) => Promise<AppSettings>;
  getAppUserData: () => Promise<DBUser>;
  getAppData: () => Promise<AppSettings>;
  getThemeData: () => Promise<Theme[]>;
  getMessagesData: () => Promise<Message[]>;
  getContactsData: () => Promise<Contacts[]>;
  getMessageSettingsData: () => Promise<MessageSettings[]>;
  getContactSettingsData: () => Promise<ContactSettings[]>;
  getPhoneNumber: () => Promise<string>;
  updateUserInDB: (user: User) => Promise<IDBValidKey>;
  IDB_AddContact: (newContact: Contacts) => Promise<void>;
  IDB_UpdateMessageSession: (
    newSession: MessageSessionType
  ) => Promise<IDBValidKey>;
  IDB_GetLastMessageSession: () => Promise<MessageSessionType>;
  IDB_AddMessage: (newMessage: Message) => Promise<IDBValidKey>;
}
