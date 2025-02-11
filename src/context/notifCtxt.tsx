import React, { createContext, ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { NotifCtxtProps, SysNotifType} from "../types/notifTypes.ts";

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
		setNotifs((prev: SysNotifType[]): SysNotifType[] =>
			prev.filter((notif: SysNotifType): boolean => notif.id !== id)
		);
	};

	const clearAllNotifs = (): void => {
		setNotifs([]);
	};

	return (
		<NotifCtxt.Provider
			value={{
				notifs,
				addSuccessNotif,
				addErrorNotif,
				removeNotif,
				showNetworkErrorNotif,
				clearAllNotifs
			}}
		>
			{children}
		</NotifCtxt.Provider>
	);
};

export default NotifCtxt;
