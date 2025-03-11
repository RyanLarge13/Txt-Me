import { IDBPDatabase } from "idb";

import { User } from "./configCtxtTypes";

export type AppSettings = {
  initialized: boolean;
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

export type Contact = {
  contacts: [];
};

export type Message = {
  messages: [];
};

export interface DBCtxtProps {
  getDB: () => Promise<IDBPDatabase>;
  initDatabase: (db: IDBPDatabase) => Promise<AppSettings>;
  getAppUserData: () => Promise<DBUser>;
  getAppData: () => Promise<AppSettings>;
  getThemeData: () => Promise<Theme[]>;
  getMessagesData: () => Promise<Message[]>;
  getContactsData: () => Promise<Contact[]>;
  getMessageSettingsData: () => Promise<MessageSettings[]>;
  getContactSettingsData: () => Promise<ContactSettings[]>;
  getPhoneNumber: () => Promise<string>;
  updateUserInDB: (user: User) => Promise<IDBValidKey>;
}
