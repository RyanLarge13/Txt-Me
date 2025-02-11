import { Dispatch, SetStateAction } from "react";

export type SysNotifType = {
 id:string;
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
	setSysNotif: Dispatch<SetStateAction<SysNotif>>;
	sysNotif: SysNotif;
}
