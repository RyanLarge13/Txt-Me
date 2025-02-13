/*
Txt Me - A learn to draw program
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

import React, { createContext, ReactNode, useEffect, useState } from "react";

import useLogger from "../hooks/useLogger";
import { useDatabase } from "./dbContext";

const ConfigContext = createContext({});

export const ConfigProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const { getDB, initDatabase } = useDatabase();

  const [appData, setAppData] = useState({
    initialized: true,
    locked: false,
    passwordType: "pin",
    authToken: "",
    showOnline: false,
  });

  const log = useLogger();

  useEffect(() => {
    openDBBAndInit();
  }, []);

  const openDBBAndInit = async () => {
    const db = await getDB();
    const appInfo = await initDatabase(db);

    log.devLog(appInfo);

    if (appInfo) {
      setAppData(appInfo);
    }
  };

  return (
    <ConfigContext.Provider
      value={{
        appData,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigContext;
