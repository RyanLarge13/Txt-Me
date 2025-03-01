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
    Contact, ContactSettings, DBCtxtProps, Message, MessageSettings, Theme
} from "../types/dbCtxtTypes.ts";

const DatabaseContext = createContext({} as DBCtxtProps);

// IDB Documentation https://www.npmjs.com/package/idb

export const DatabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const log = useLogger();

  const buildAppConfig = async (db: IDBPDatabase) => {
    const appSettings = {
      initialized: true,
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

  const buildThemeConfig = async (db: IDBPDatabase) => {
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

  const buildMessagesAndContacts = async (db: IDBPDatabase) => {
    const messages = { messages: [] };
    const contacts = { contacts: [] };

    await db.put("messages", messages, "messages");
    await db.put("contacts", contacts, "contacts");
  };

  const buildMessageSettings = async (db: IDBPDatabase) => {
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

  const buildContactSettings = async (db: IDBPDatabase) => {
    const contactSettings = {
      showImage: true,
      showLatestMessages: true,
      showHowMayUnreadMessages: true,
      sort: "last-name",
      order: "desc",
    };

    await db.put("contactSettings", contactSettings, "contactSettings");
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
  };

  const getDB = async () => {
    const db = await openDB(
      import.meta.env.VITE_INDEX_DB_NAME,
      import.meta.env.VITE_INDEX_DB_V,
      {
        upgrade(db) {
          db.createObjectStore("app");
          db.createObjectStore("theme");
          db.createObjectStore("messages");
          db.createObjectStore("contacts");
          db.createObjectStore("messageSettings");
          db.createObjectStore("contactSettings");
        },
      }
    );
    return db;
  };

  const initDatabase = async (db: IDBPDatabase) => {
    const userInitialized = await db.get("app", "settings");

    log.devLog(`user from indexedDB`, userInitialized);

    if (userInitialized && userInitialized?.initialized) {
      return userInitialized;
    }

    await addDefaultConfiguration(db);

    return userInitialized;
  };

  // Get DB Data --------------------------------------------------------------------------------
  const getAppData = async () => (await getDB()).get("app", "settings");
  const getAppUserData = async () => (await getDB()).get("app", "user");
  const getThemeData = async (): Promise<Theme[]> =>
    (await getDB()).getAll("theme");
  const getMessagesData = async (): Promise<Message[]> =>
    (await getDB()).getAll("messages");
  const getContactsData = async (): Promise<Contact[]> =>
    (await getDB()).getAll("contacts");
  const getMessageSettingsData = async (): Promise<MessageSettings[]> =>
    (await getDB()).getAll("messageSettings");
  const getContactSettingsData = async (): Promise<ContactSettings[]> =>
    (await getDB()).getAll("contactSettings");
  const getPhoneNumber = async (): Promise<string> =>
    (await getDB())
      .get("app", "settings")
      .then((settings) => settings.phoneNumber);
  // Get DB Data --------------------------------------------------------------------------------

  // Put/Patch DB Data ----------------------------------------------------------------------------
  const updateUserInDB = async (user: User): Promise<IDBValidKey> =>
    (await getDB()).put("app", user, "user");
  // Put/Patch DB Data ----------------------------------------------------------------------------

  return (
    <DatabaseContext.Provider
      value={{
        getDB,
        initDatabase,
        getAppUserData,
        getAppData,
        getThemeData,
        getMessagesData,
        getContactsData,
        getMessageSettingsData,
        getContactSettingsData,
        getPhoneNumber,
        updateUserInDB,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);
