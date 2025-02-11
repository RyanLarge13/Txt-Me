const dbName: string = import.meta.env.VITE_INDEX_DB_NAME;
const dbVersion: string = import.meta.env.VITE_INDEX_DB_V;

let db = null;

export const initializeDB = () => {
  const request = indexedDB.open(dbName, parseInt(dbVersion));

  request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    console.log(event);
    return;
  };

  request.onsuccess = (event: Event) => {
    console.log(event);
    db = event;
    return;
  };

  request.onerror = (event: Event) => {
    console.log(`Error opening indexedDB ${event?.target || ""}`);
  };
};
