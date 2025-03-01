import { IDBPDatabase } from "idb";

type AppSettings = {
  initialized: boolean;
  locked: boolean;
  passwordType: string;
  showOnline: boolean;
};

type DBUser = {
  userId: number;
  username: string;
  email: string;
  phoneNumber: string;
  authToken: string;
};

type Theme = {
  darkMode: boolean;
  accent: string;
  background: string;
  animations: {
    speed: number;
    spring: boolean;
  };
};

type MessageSettings = {
  showImg: boolean;
  showLatestMessage: boolean;
  showTimeOfLatestMessage: boolean;
  showHowManyUnread: boolean;
  sort: string;
  order: string;
  showYouAreTyping: boolean;
  showYouHaveRead: boolean;
};

type ContactSettings = {
  showImage: boolean;
  showLatestMessages: boolean;
  showHowMayUnreadMessages: boolean;
  sort: string;
  order: string;
};

type Contact = {
  contacts: [];
};

type Message = {
  messages: [];
};

export interface DBCtxtProps {
  getDB: () => Promise<IDBPDatabase>;
  initDatabase: (db: IDBPDatabase) => Promise<AppSettings>;
  getAppUserData: () => Promise<DBUser>;
  getAppData: () => Promise<AppSettings>;
  getThemeData: () => Promise<Theme>;
  getMessagesData: () => Promise<Message>;
  getContactsData: () => Promise<Contact>;
  getMessageSettingsData: () => Promise<MessageSettings>;
  getContactSettingsData: () => Promise<ContactSettings>;
  getPhoneNumber: () => Promise<string>;
  updateUserInDB: () => Promise<void>;
}
