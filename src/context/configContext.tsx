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

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import useLogger from "../hooks/useLogger";
import { AppSettingsType, ThemeType, UserType } from "../types/appDataTypes";
import { ConfigContextType } from "../types/configCtxtTypes";
import {
  defaultAppSettings,
  defaultTheme,
  defaultUser,
} from "../utils/constants";
import { useDatabase } from "./dbContext";

export const ConfigContext = createContext({} as ConfigContextType);

export const ConfigProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const { IDB_GetDB, IDB_InitDatabase, IDB_GetThemeData, IDB_GetAppUserData } =
    useDatabase();

  const [appData, setAppData] = useState<AppSettingsType>(defaultAppSettings);

  const [theme, setTheme] = useState<ThemeType>(defaultTheme);

  const [user, setUser] = useState<UserType>(defaultUser);

  const log = useLogger();

  useEffect(() => {
    openDBBAndInit();
  }, []);

  const openDBBAndInit = async () => {
    const db = await IDB_GetDB();
    const appInfo = await IDB_InitDatabase(db);

    log.devLog(
      "app info returned from the index db initialization method",
      appInfo
    );

    if (appInfo) {
      setAppData(appInfo);
    }

    fetchLocalThemeData();
    fetchLocalUserData();
  };

  const fetchLocalThemeData = async () => {
    const themeData = await IDB_GetThemeData();

    if (themeData) {
      setTheme(themeData[0]);
    }
  };

  const fetchLocalUserData = async () => {
    const user = await IDB_GetAppUserData();

    if (user) {
      setUser(user);
    } else {
      log.devLog("No user exists in local indexedDB");
    }
  };

  const contextValue = useMemo(() => {
    return {
      getAppData: <K extends keyof AppSettingsType>(key: K) => appData[key],
      getThemeData: <K extends keyof ThemeType>(key: K) => theme[key],
      getUserData: <K extends keyof UserType>(key: K) => user[key],
      setUser,
      setAppData,
      setTheme,
    };
  }, [user, theme, appData]);

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be within a ConfigProvider");
  }

  return context;
};
