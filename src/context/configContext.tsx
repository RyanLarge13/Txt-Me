import React, { createContext, ReactNode, useEffect } from "react";

import { useDatabase } from "./dbContext";

const ConfigContext = createContext({});

export const ConfigProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const { getConfig } = useDatabase();

  useEffect(() => {
    fetchAndStoreConfig();
  });

  const fetchAndStoreConfig = async () => {
    // const config = await getConfig();
  };

  return <ConfigContext.Provider value={{}}>{children}</ConfigContext.Provider>;
};

export default ConfigContext;
