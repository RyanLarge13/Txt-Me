import { Dispatch, SetStateAction } from "react";

export type SysNotifType = {
	id: string;
	title: string;
	text: string;
	color: string;
	hasCancel: boolean;
	time: Date;
	actions: Actions[];
};

export type Actions = {
	text: string;
	func: () => void;
};

export interface NotifCtxtProps {
	notifs: SysNotifType[];
	addSuccessNotif: () => void;
	addErrorNotif: () => void;
	removeNotif: () => void;
	showNetworkErrorNotif: () => void;
	clearAllNotifs: () => void;
}
