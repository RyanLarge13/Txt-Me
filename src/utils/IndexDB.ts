class DBManager {
  // Type DBManager
  db: IDBDatabase | null;
  request: IDBOpenDBRequest;
  // Type DBManager

  constructor() {
    const dbName: string = import.meta.env.VITE_INDEX_DB_NAME;
    const dbVersion: string = import.meta.env.VITE_INDEX_DB_V;
    this.db = null;
    this.request = indexedDB.open(dbName, parseInt(dbVersion));

    // Handle callbacks in constructor scope -------------------------------------
    this.request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      console.log(event);
      return;
      // this.db = event.target.result;
    };

    this.request.onsuccess = (event: Event) => {
      console.log(event);
      return;
      // this.db = event.target.result;
    };

    this.request.onerror = (event: Event) => {
      console.log(`Error opening indexedDB ${event?.target || ""}`);
    };
    // Handle callbacks in constructor scope -------------------------------------
  }
}

export default DBManager;
