interface ImportMetaEnv {
  readonly VITE_INDEX_DB_NAME: string;
  readonly VITE_INDEX_DB_V: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
