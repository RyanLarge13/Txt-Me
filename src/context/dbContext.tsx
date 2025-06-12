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
import { User } from "../types/configCtxtTypes.ts";
import {
  ContactSettings,
  DBCtxtProps,
  DBUser,
  DraftType,
  MessageSettings,
  Theme,
} from "../types/dbCtxtTypes.ts";
import { Contacts, Message, MessageSessionType } from "../types/userTypes.ts";
import { defaultAppSettings, defaultUser } from "../utils/constants.ts";

const DatabaseContext = createContext({} as DBCtxtProps);

// IDB Documentation https://www.npmjs.com/package/idb

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
    };

    const appUser = {
      userId: 0,
      authToken: "",
      username: "",
      email: "",
      phoneNumber: "",
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
    const messages: Message[] = [];
    const contacts: Contacts[] = [];

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
        },
      }
    );
    return db;
  };

  const IDB_InitDatabase = async (db: IDBPDatabase) => {
    const userInitialized =
      (await db.get("app", "settings")) || defaultAppSettings;

    log.devLog(`User from indexedDB`, userInitialized);

    if (userInitialized && userInitialized?.initialized) {
      return userInitialized;
    }

    await addDefaultConfiguration(db);

    return userInitialized;
  };

  // Get DB Data --------------------------------------------------------------------------------
  const IDB_GetAppData = async () => (await IDB_GetDB()).get("app", "settings");
  const IDB_GetDrafts = async (): Promise<DraftType> =>
    (await IDB_GetDB()).get("drafts", "drafts");
  const IDB_GetAppUserData = async () => (await IDB_GetDB()).get("app", "user");
  const IDB_GetThemeData = async (): Promise<Theme[]> =>
    (await IDB_GetDB()).getAll("theme");
  const IDB_GetMessagesData = async (): Promise<Message[]> =>
    (await IDB_GetDB()).get("messages", "messages");
  const IDB_GetContactsData = async (): Promise<Contacts[]> =>
    (await IDB_GetDB()).get("contacts", "contacts");
  const IDB_GetMessageSettingsData = async (): Promise<MessageSettings[]> =>
    (await IDB_GetDB()).getAll("messageSettings");
  const IDB_GetContactSettingsData = async (): Promise<ContactSettings[]> =>
    (await IDB_GetDB()).getAll("contactSettings");
  const IDB_GetPhoneNumber = async (): Promise<string> =>
    (await IDB_GetDB())
      .get("app", "user")
      .then((settings: DBUser) => settings.phoneNumber);
  const IDB_GetLastMessageSession = async (): Promise<MessageSessionType> =>
    (await IDB_GetDB()).get("messageSession", "messageSession");
  // Get DB Data --------------------------------------------------------------------------------

  // Put/Patch DB Data ----------------------------------------------------------------------------
  const IDB_UpdateUserInDB = async (user: User): Promise<IDBValidKey> =>
    (await IDB_GetDB()).put("app", user, "user");
  const M_UpdateContactsInDB = async (
    contacts: Contacts[]
  ): Promise<IDBValidKey> =>
    (await IDB_GetDB()).put("contacts", contacts, "contacts");
  const M_UpdateMessagesInDB = async (messages: Message[]) =>
    (await IDB_GetDB()).put("messages", messages, "messages");

  const IDB_AddContact = async (newContact: Contacts): Promise<void> => {
    const currentContacts = await IDB_GetContactsData();
    log.devLog(
      "Contacts returned from IDB when adding server contacts to local database",
      currentContacts
    );

    const newContacts = currentContacts.filter(
      (c: Contacts) => c.contactid !== newContact.contactid
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
    newSession: MessageSessionType
  ): Promise<IDBValidKey> =>
    (await IDB_GetDB()).put("messageSession", newSession, "messageSession");

  const IDB_AddMessage = async (newMessage: Message): Promise<IDBValidKey> => {
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

  const IDB_UpdateContact = async (newContact: Contacts): Promise<void> => {
    const currentContacts: Contacts[] = (await IDB_GetContactsData()) || [];

    if (currentContacts.length === 0) {
      M_UpdateContactsInDB([newContact]);
    } else {
      const updatedContacts = currentContacts.map((c: Contacts) => {
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

  const IDB_UpdateMessage = async (message: Message): Promise<void> => {
    const messages = await IDB_GetMessagesData();

    const newMessages = messages.map((m: Message) => {
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
  // Put/Patch DB Data ----------------------------------------------------------------------------

  // Delete DB Methods ------------------------------------------------------------------------------
  const IDB_DeleteContact = async (contactId: string): Promise<void> => {
    const currentContacts: Contacts[] = (await IDB_GetContactsData()) || [];

    if (currentContacts.length < 1) {
      return;
    }

    const newContacts = currentContacts.filter(
      (c: Contacts) => c.contactid !== contactId
    );

    M_UpdateContactsInDB(newContacts);
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
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);
