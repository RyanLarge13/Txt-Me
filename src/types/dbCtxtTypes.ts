import { IDBPDatabase } from "idb";

import { AppData, User } from "./configCtxtTypes";
import { Contacts, Message, MessageSessionType } from "./userTypes";

export type AppSettings = {
  initialized: boolean;
  authToken: string;
  locked: boolean;
  passwordType: string;
  showOnline: boolean;
  webPushSubscription: {
    subscription: null | PushSubscription;
    subscribed: boolean;
  };
};

export type DBUser = {
  userId: string;
  username: string;
  email: string;
  phoneNumber: string;
  authToken: string;
  RSAKeyPair: {
    private: null | CryptoKey;
    public: null | CryptoKey;
    expiresAt: Date;
  };
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

export type DraftType = {
  contact: {
    contactid: string;
    name: string;
    email: string;
    number: string;
    createdat: Date;
    space: string;
    nickname: string;
    address: string;
    website: string;
    avatar: null | File;
    synced: boolean;
  } | null;
  messages: {
    messageid: string;
    message: string;
    sent: boolean;
    sentat: Date;
    delivered: boolean;
    deliveredat: Date | null;
    read: boolean;
    readat: Date | null;
    fromnumber: string;
    tonumber: string;
    synced: boolean;
  }[];
};

export interface DBCtxtProps {
  IDB_GetMessageSessions: () => Promise<[string, MessageSessionType][]>;
  IDB_GetDB: () => Promise<IDBPDatabase>;
  IDB_GetDrafts: () => Promise<DraftType>;
  IDB_InitDatabase: (db: IDBPDatabase) => Promise<AppSettings>;
  IDB_GetAppUserData: () => Promise<DBUser>;
  IDB_GetAppData: () => Promise<AppSettings>;
  IDB_GetThemeData: () => Promise<Theme[]>;
  IDB_GetMessagesData: () => Promise<Message[]>;
  IDB_GetContactsData: () => Promise<Contacts[]>;
  IDB_GetMessageSettingsData: () => Promise<MessageSettings[]>;
  IDB_GetContactSettingsData: () => Promise<ContactSettings[]>;
  IDB_GetPhoneNumber: () => Promise<string>;
  IDB_UpdateUserInDB: (user: User) => Promise<IDBValidKey>;
  IDB_UpdateContactInDraft: (contact: DraftType["contact"]) => Promise<void>;
  IDB_AddContact: (newContact: Contacts) => Promise<void>;
  IDB_UpdateMessageSession: (
    newSession: MessageSessionType | null
  ) => Promise<IDBValidKey>;
  IDB_GetLastMessageSession: () => Promise<MessageSessionType>;
  IDB_AddMessage: (newMessage: Message) => Promise<IDBValidKey>;
  IDB_UpdateContact: (newContact: Contacts) => Promise<void>;
  IDB_ClearContactDraft: () => Promise<void>;
  IDB_DeleteContact: (contactId: string) => Promise<void>;
  IDB_LogoutAndReset: () => Promise<void>;
  IDB_UpdateMessage: (message: Message) => Promise<void>;
  IDB_UpdateAppDataWebPush: (
    data: AppData["webPushSubscription"]
  ) => Promise<void>;
  IDB_UpdateMessages: (newMessages: Message[]) => Promise<void>;
  IDB_AppendMessages: (newMessages: Message[]) => Promise<void>;
  IDB_DeleteMessages: (messages: Message[]) => Promise<void>;
}
