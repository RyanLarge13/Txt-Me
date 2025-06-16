/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react/jsx-runtime" />

interface ServiceWorkerRegistration {
  sync?: {
    register: (tag: string) => Promise<void>;
  };

  periodicSync?: {
    register: (tag: string, options: { minInterval: number }) => Promise<void>;
  };
}
