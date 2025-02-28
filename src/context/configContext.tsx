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

import React, {
	createContext,
	ReactNode,
	useMemo,
	useContext,
	useEffect,
	useState
} from "react";

import useLogger from "../hooks/useLogger";
import { AppData, ConfigContextType, Theme } from "../types/configCtxtTypes";
import { useDatabase } from "./dbContext";

const ConfigContext = createContext({} as ConfigContextType);

export const ConfigProvider = ({
	children
}: {
	children: ReactNode;
}): JSX.Element => {
	const { getDB, initDatabase, getThemeData, getAppUserData } = useDatabase();

	const [appData, setAppData] = useState<AppData>({
		initialized: true,
		locked: false,
		passwordType: "pin",
		authToken: "",
		showOnline: false
	});

	const [theme, setTheme] = useState<Theme>({
		darkMode: true,
		accent: "#fff",
		background: "none",
		animations: {
			speed: 0.25,
			spring: true
		}
	});

	const [user, setUser] = useState({
		userId: 0,
		authToken: "",
		username: "",
		email: "",
		phoneNumber: ""
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

		fetchLocalThemeData();
		fetchLocalUserData();
	};

	const fetchLocalThemeData = async () => {
		const themeData = await getThemeData();

		if (themeData) {
			setTheme(themeData);
		}
	};

	const fetchLocalUserData = async () => {
		const user = await getAppUserData();

		if (user) {
			setUser(user);
		} else {
			log.devLog("No user exists in local indexedDB");
		}
	};

	const contextValue = useMemo(() => {
		return {
			getAppData: key => appData[key],
			getThemeData: key => theme[key],
			getUserData: key => user[key],
			setUser,
			setAppData,
			setTheme
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

export const useUserData = key => {
	const { getUserData, setUser } = useContext(ConfigContext);
	const [value, setValue] = useState(() => getUserData(key));

	useEffect(() => {
		setValue(getUserData(key));
	}, [getUserData(key)]);

	return [value, setUser];
};
