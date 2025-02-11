import React, { createContext, ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { NotifCtxtProps } from "../types/notifTypes.ts";

const NotifCtxt = createContext({} as NotifCtxtProps);

export const NotifProvider = ({
	children
}: {
	children: ReactNode;
}): JSX.Element => {
	const [notifs, setNotifs] = useState([]);

	const addSuccessNotif = (): void => {};

	const addErrorNotif = (): void => {};

	const showNetworkErrorNotif = (): void => {};

	const removeNotif = (id: string): void => {
		setNotifs((prev: SysNotif[]): SysNotif[] =>
			prev.filter((notif: SysNotif): boolean => notif.id !== id)
		);
	};

	const clearAllNotifs = (): void => {
		setNotifs([]);
	};

	return (
		<NotifCtxt.Provider
			value={{
				notifs
			}}
		>
			{children}
		</NotifCtxt.Provider>
	);
};

export default NotifCtxt;
