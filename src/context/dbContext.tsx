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

/// <reference types="vite/client" />

import { IDBPDatabase, openDB } from "idb";
import { createContext, useContext } from "react";

import useLogger from "../hooks/useLogger.ts";
import { AppSettingsType, ThemeType, UserType } from "../types/appDataTypes.ts";
import { ContactSettingsType, ContactType } from "../types/contactTypes.ts";
import { DBCtxtProps, DraftType } from "../types/dbCtxtTypes.ts";
import {
  MessageSessionType,
  MessageSettingsType,
  MessageType,
} from "../types/messageTypes.ts";
import { defaultAppSettings, defaultUser } from "../utils/constants.ts";
import {
  Crypto_ExportRSAPrivateKey,
  Crypto_ExportRSAPublicKey,
  Crypto_GenRSAKeyPair,
} from "../utils/crypto.ts";
import { messageFoundIn, tryCatch } from "../utils/helpers.ts";

const DatabaseContext = createContext({} as DBCtxtProps);

// IDB Documentation https://www.npmjs.com/package/idb

/*
  TODO:
    IMPLEMENT:
      1. Remove all try catch blocks from this file that make 
      more sense to be handled from inside the caller of the method
*/

const M_GenRSAKeys = async (): Promise<CryptoKeyPair> => {
  try {
    const RSAKeyPair = await Crypto_GenRSAKeyPair();
    return RSAKeyPair;
  } catch (err) {
    // Throw, this should not fail
    throw new Error(
      "Error generating RSA key pairs. Check Crypto_GenRSAKeyPair function in utils"
    );
  }
};

export const DatabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const log = useLogger();

  const buildAppConfig = async (db: IDBPDatabase): Promise<void> => {
    const appSettings = {
      initialized: true,
      authToken: "",
      locked: false,
      passwordType: "pin",
      showOnline: false,
      webPushSubscription: {
        subscription: null,
        subscribed: false,
      },
    };

    const RSAKeyPair = await M_GenRSAKeys();

    const { data: exportedRSAPublicKey, error: exportRSAKeyError } =
      await tryCatch<ArrayBuffer>(() => Crypto_ExportRSAPublicKey(RSAKeyPair));
    const { data: exportedRSAPrivateKey, error: exportRSAKeyErrorPrivate } =
      await tryCatch<ArrayBuffer>(() => Crypto_ExportRSAPrivateKey(RSAKeyPair));

    if (
      !exportedRSAPrivateKey ||
      !exportedRSAPublicKey ||
      exportRSAKeyError ||
      exportRSAKeyErrorPrivate
    ) {
      throw new Error(
        `Error generating exported RSA key pairs. ${exportRSAKeyError}... AND ${exportRSAKeyErrorPrivate}`
      );
    }

    const appUser = {
      userId: "",
      authToken: "",
      username: "",
      email: "",
      phoneNumber: "",
      RSAKeyPair: {
        private: exportedRSAPrivateKey,
        public: exportedRSAPublicKey,
        expiresAt: new Date(new Date().getDate() + 7),
      },
    };

    await db.put("app", appSettings, "settings");
    await db.put("app", appUser, "user");
  };

  const buildThemeConfig = async (db: IDBPDatabase): Promise<void> => {
    const theme = {
      darkMode: true,
      accent: "#fff",
      background: "none",
      animations: {
        speed: 0.25,
        spring: true,
      },
    };

    await db.put("theme", theme, "theme");
  };

  const buildMessagesAndContacts = async (db: IDBPDatabase): Promise<void> => {
    const messages: MessageType[] = [];
    const contacts: ContactType[] = [];

    await db.put("messages", messages, "messages");
    await db.put("contacts", contacts, "contacts");
  };

  const buildMessageSettings = async (db: IDBPDatabase): Promise<void> => {
    const messageSettings = {
      showImg: true,
      showLatestMessage: true,
      showTimeOfLatestMessage: true,
      showHowManyUnread: true,
      sort: "newest",
      order: "desc",
      showYouAreTyping: false,
      showYouHaveRead: false,
    };

    await db.put("messageSettings", messageSettings, "messageSettings");
  };

  const buildContactSettings = async (db: IDBPDatabase): Promise<void> => {
    const contactSettings = {
      showImage: true,
      showLatestMessages: true,
      showHowMayUnreadMessages: true,
      sort: "last-name",
      order: "desc",
    };

    await db.put("contactSettings", contactSettings, "contactSettings");
  };

  const buildMessageSession = async (db: IDBPDatabase): Promise<void> => {
    const lastSession: MessageSessionType = {
      number: "-1",
      messages: [],
      contact: null,
      AESKey: null,
      receiversRSAPublicKey: null,
    };

    await db.put("messageSession", lastSession, "messageSession");
  };

  const buildDrafts = async (db: IDBPDatabase): Promise<void> => {
    const drafts = {
      contact: null,
      messages: [],
    };

    await db.put("drafts", drafts, "drafts");
  };

  const buildMessageSessions = async (db: IDBPDatabase): Promise<void> => {
    const messageSessions: MessageSessionType[] = [];

    await db.put("message-sessions", messageSessions, "message-sessions");
  };

  const addDefaultConfiguration = async (db: IDBPDatabase) => {
    try {
      await buildAppConfig(db);
    } catch (err) {
      log.logAllError(`Building app config. \nError: ${err}`);
    }
    try {
      await buildThemeConfig(db);
    } catch (err) {
      log.logAllError(`Building theme config. \nError: ${err}`);
    }

    try {
      await buildMessagesAndContacts(db);
    } catch (err) {
      log.logAllError(`Building message and contacts config. \nError: ${err}`);
    }

    try {
      await buildMessageSettings(db);
    } catch (err) {
      log.logAllError(`Building messages config. \nError: ${err}`);
    }

    try {
      await buildContactSettings(db);
    } catch (err) {
      log.logAllError(`Building contacts config. \nError: ${err}`);
    }

    try {
      await buildMessageSession(db);
    } catch (err) {
      log.logAllError("Building messageSession default config. Error: ", err);
    }

    try {
      await buildDrafts(db);
    } catch (err) {
      log.logAllError("Building drafts table default config. Error: ", err);
    }

    try {
      await buildMessageSessions(db);
    } catch (err) {
      log.logAllError(
        "Building message sessions table default config. Error: ",
        err
      );
    }
  };

  const IDB_GetDB = async () => {
    const db = await openDB(
      import.meta.env.VITE_INDEX_DB_NAME,
      import.meta.env.VITE_INDEX_DB_V,
      {
        upgrade(db: IDBPDatabase) {
          db.createObjectStore("app");
          db.createObjectStore("theme");
          db.createObjectStore("messages");
          db.createObjectStore("contacts");
          db.createObjectStore("messageSettings");
          db.createObjectStore("contactSettings");
          db.createObjectStore("messageSession");
          db.createObjectStore("drafts");
          db.createObjectStore("message-sessions");
        },
      }
    );
    return db;
  };

  const IDB_InitDatabase = async (db: IDBPDatabase) => {
    const storedUser = (await db.get("app", "settings")) || defaultAppSettings;

    log.devLog(`User from indexedDB`, storedUser);

    if (storedUser && storedUser?.initialized) {
      return storedUser;
    }

    await addDefaultConfiguration(db);

    return storedUser;
  };

  // Get DB Data --------------------------------------------------------------------------------
  const IDB_GetAppData = async () => (await IDB_GetDB()).get("app", "settings");
  const IDB_GetDrafts = async (): Promise<DraftType> =>
    (await IDB_GetDB()).get("drafts", "drafts");
  const IDB_GetMessageSessions = async (): Promise<
    [string, MessageSessionType][]
  > => (await IDB_GetDB()).get("message-sessions", "message-sessions");
  const IDB_GetAppUserData = async () => (await IDB_GetDB()).get("app", "user");
  const IDB_GetThemeData = async (): Promise<ThemeType[]> =>
    (await IDB_GetDB()).getAll("theme");
  const IDB_GetMessagesData = async (): Promise<MessageType[]> =>
    (await IDB_GetDB()).get("messages", "messages");
  const IDB_GetContactsData = async (): Promise<ContactType[]> =>
    (await IDB_GetDB()).get("contacts", "contacts");
  const IDB_GetMessageSettingsData = async (): Promise<MessageSettingsType[]> =>
    (await IDB_GetDB()).getAll("messageSettings");
  const IDB_GetContactSettingsData = async (): Promise<ContactSettingsType[]> =>
    (await IDB_GetDB()).getAll("contactSettings");
  const IDB_GetPhoneNumber = async (): Promise<string> =>
    (await IDB_GetDB())
      .get("app", "user")
      .then((settings: UserType) => settings.phoneNumber);
  const IDB_GetLastMessageSession = async (): Promise<MessageSessionType> =>
    (await IDB_GetDB()).get("messageSession", "messageSession");
  // Get DB Data --------------------------------------------------------------------------------

  // Put/Patch DB Data ----------------------------------------------------------------------------
  const IDB_UpdateUserInDB = async (user: UserType): Promise<IDBValidKey> =>
    (await IDB_GetDB()).put("app", user, "user");
  const M_UpdateContactsInDB = async (
    contacts: ContactType[]
  ): Promise<IDBValidKey> =>
    (await IDB_GetDB()).put("contacts", contacts, "contacts");
  const M_UpdateMessagesInDB = async (messages: MessageType[]) =>
    (await IDB_GetDB()).put("messages", messages, "messages");

  const IDB_AddContact = async (newContact: ContactType): Promise<void> => {
    const currentContacts = await IDB_GetContactsData();
    log.devLog(
      "Contacts returned from IDB when adding server contacts to local database",
      currentContacts
    );

    const newContacts = currentContacts.filter(
      (c: ContactType) => c.contactid !== newContact.contactid
    );

    log.devLog(
      "Here are the filtered contacts that will be added to the local indexedDB contacts array along with current contacts and newContact from server",
      currentContacts,
      newContact,
      newContacts
    );

    log.devLog(
      "This is what the array will look like when finally updating the db with the new contacts",
      [...newContacts, newContact]
    );

    try {
      await M_UpdateContactsInDB([...newContacts, newContact]);
    } catch (err) {
      log.devLog("Error adding new contacts to local idb database", err);
    }
  };

  const IDB_UpdateMessageSession = async (
    newSession: MessageSessionType | null
  ): Promise<IDBValidKey> =>
    (await IDB_GetDB()).put("messageSession", newSession, "messageSession");

  const IDB_AddMessage = async (
    newMessage: MessageType
  ): Promise<IDBValidKey> => {
    const storedMessages = (await IDB_GetMessagesData()) || [];

    const newMessages = [...storedMessages, newMessage];
    return (await IDB_GetDB()).put("messages", newMessages, "messages");
  };

  const IDB_UpdateContactInDraft = async (
    contact: DraftType["contact"]
  ): Promise<void> => {
    const storedDrafts: DraftType = (await IDB_GetDrafts()) || {
      contact: null,
      messages: [],
    };

    const newDrafts = { ...storedDrafts, contact: contact };

    (await IDB_GetDB()).put("drafts", newDrafts, "drafts");
  };

  const IDB_UpdateContact = async (newContact: ContactType): Promise<void> => {
    const currentContacts: ContactType[] = (await IDB_GetContactsData()) || [];

    if (currentContacts.length === 0) {
      M_UpdateContactsInDB([newContact]);
    } else {
      const updatedContacts = currentContacts.map((c: ContactType) => {
        if (c.contactid === newContact.contactid) {
          return newContact;
        } else {
          return c;
        }
      });

      M_UpdateContactsInDB(updatedContacts);
    }
  };

  const IDB_ClearContactDraft = async (): Promise<void> => {
    const storedDrafts: DraftType = (await IDB_GetDrafts()) || {
      contact: null,
      messages: [],
    };

    const newDrafts = { ...storedDrafts, contact: null };

    (await IDB_GetDB()).put("drafts", newDrafts, "drafts");
  };

  const IDB_UpdateMessage = async (message: MessageType): Promise<void> => {
    const messages = await IDB_GetMessagesData();

    const newMessages = messages.map((m: MessageType) => {
      if (m.messageid === message.messageid) {
        return message;
      } else {
        return m;
      }
    });

    try {
      await M_UpdateMessagesInDB(newMessages);
    } catch (err) {
      log.logAllError("Error updating message in IndexedDB", err);
    }
  };

  const IDB_UpdateAppDataWebPush = async (
    newData: AppSettingsType["webPushSubscription"]
  ): Promise<void> => {
    const currentSettings: AppSettingsType = await IDB_GetAppData();

    currentSettings.webPushSubscription = newData;

    (await IDB_GetDB()).put("app", currentSettings, "settings");
  };

  const IDB_UpdateMessages = async (
    newMessages: MessageType[]
  ): Promise<void> => {
    const existingMessages: MessageType[] = await IDB_GetMessagesData();

    const updatedMessages = existingMessages.map((m: MessageType) => {
      return messageFoundIn(m, newMessages);
    });

    (await IDB_GetDB()).put("messages", updatedMessages, "messages");
  };

  const IDB_AppendMessages = async (
    newMessages: MessageType[]
  ): Promise<void> => {
    const existingMessages: MessageType[] = await IDB_GetMessagesData();

    const updatedMessages = existingMessages.concat(newMessages);

    (await IDB_GetDB()).put("messages", updatedMessages, "messages");
  };
  // Put/Patch DB Data ----------------------------------------------------------------------------

  // Delete DB Methods ------------------------------------------------------------------------------
  const IDB_DeleteContact = async (contactId: string): Promise<void> => {
    const currentContacts: ContactType[] = (await IDB_GetContactsData()) || [];

    if (currentContacts.length < 1) {
      return;
    }

    const newContacts = currentContacts.filter(
      (c: ContactType) => c.contactid !== contactId
    );

    M_UpdateContactsInDB(newContacts);
  };

  const IDB_DeleteMessages = async (messages: MessageType[]): Promise<void> => {
    if (messages.length < 1) {
      return;
    }

    const existingMessages: MessageType[] = (await IDB_GetMessagesData()) || [];

    if (existingMessages.length < 1) {
      IDB_UpdateMessages([]);
      return;
    }

    let updatedMessages: MessageType[] = existingMessages;

    messages.forEach((m: MessageType) => {
      updatedMessages = updatedMessages.filter(
        (_m: MessageType) => _m.messageid !== m.messageid
      );
    });

    await IDB_UpdateMessages(updatedMessages);
  };
  // Delete DB Methods ------------------------------------------------------------------------------

  // Reset to default values ------------------------------------------------------------------------
  const IDB_LogoutAndReset = async (): Promise<void> => {
    const db = await IDB_GetDB();

    await db.put("app", defaultAppSettings, "settings");
    await db.put("app", defaultUser, "user");

    await db.put("messages", [], "messages");
    await db.put("contacts", [], "contacts");
  };
  // Reset to default values ------------------------------------------------------------------------

  return (
    <DatabaseContext.Provider
      value={{
        IDB_InitDatabase,

        // Getters ------------------------------
        IDB_GetDB,
        IDB_GetDrafts,
        IDB_GetAppUserData,
        IDB_GetAppData,
        IDB_GetThemeData,
        IDB_GetMessagesData,
        IDB_GetContactsData,
        IDB_GetMessageSettingsData,
        IDB_GetContactSettingsData,
        IDB_GetPhoneNumber,
        IDB_GetLastMessageSession,
        IDB_GetMessageSessions,
        // Getters ------------------------------

        // Setters ------------------------------
        IDB_UpdateUserInDB,
        IDB_AddContact,
        IDB_UpdateMessageSession,
        IDB_AddMessage,
        IDB_UpdateContactInDraft,
        IDB_UpdateContact,
        IDB_ClearContactDraft,
        IDB_DeleteContact,
        IDB_LogoutAndReset,
        IDB_UpdateMessage,
        IDB_UpdateAppDataWebPush,
        IDB_UpdateMessages,
        IDB_AppendMessages,
        IDB_DeleteMessages,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);
