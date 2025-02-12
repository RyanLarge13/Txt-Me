import { openDB } from "idb";
import React, { createContext, useContext } from "react";

const addDefaultConfiguration = (tx) => {
  tx.objectStore("auth").put({
    locked: false,
    passwordType: "pin",
    authToken: "",
    showOnline: false,
    user: {
      userId: 0,
      username: "",
      email: "",
      phoneNumber: "",
    },
  });
};

const DatabaseContext = createContext({} as any);

// IDB Documentation https://www.npmjs.com/package/idb

export const DatabaseProvider = ({ children }) => {
  const getDB = async () =>
    openDB(
      import.meta.env.VITE_INDEX_DB_NAME,
      import.meta.env.VITE_INDEX_DB_V,
      {
        upgrade(db) {
          db.createObjectStore("auth");
          db.createObjectStore("theme");
          db.createObjectStore("messages");
          db.createObjectStore("contacts");
          db.createObjectStore("messageSettings");
          db.createObjectStore("contactSettings");

          const tx = db.transaction(
            [
              "auth",
              "theme",
              "messages",
              "contacts",
              "messageSettings",
              "contactSettings",
            ],
            "readwrite"
          );

          addDefaultConfiguration(tx);
        },
      }
    );

  const getAuthData = async () => (await getDB()).getAll("auth");
  const getThemeData = async () => (await getDB()).getAll("theme");
  const getMessagesData = async () => (await getDB()).getAll("messages");
  const getContactsData = async () => (await getDB()).getAll("contacts");
  const getMessageSettingsData = async () =>
    (await getDB()).getAll("messageSettings");
  const getContactSettingsData = async () =>
    (await getDB()).getAll("contactSettings");

  return (
    <DatabaseContext.Provider
      value={{
        getAuthData,
        getThemeData,
        getMessagesData,
        getContactsData,
        getMessageSettingsData,
        getContactSettingsData,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);
