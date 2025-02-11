import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useContext, useRef } from "react";
import { FaCog } from "react-icons/fa";
import NotifCtxt from "../context/notifCtxt.tsx";
import { SysNotifType, Action } from "../types/notifTypes.ts";

const Notification = ({ notif, index }): JSX.Element => {
	const { removeNotif } = useContext(NotifCtxt);

	const [cancel, setCancel] = useState(notif.hasCancel);

	const notifTimeoutRef = useRef(null);

	const handleDrag = (e): void => {
		const end = e.clientX;
		const minDistance = window.innerWidth / 1.4;
		if (end > minDistance) {
			removeNotif(notif.id);
		}
	};

	useEffect(() => {
		if (notifTimeoutRef.current) {
			if (cancel === false) {
				notifTimeoutRef.current = setTimeout(() => {
					removeNotif(notif.id);
				}, 5000);
			} else {
				clearTimeout(notifTimeoutRef.current);
			}
		}
		return () => {
			clearTimeout(notifTimeoutRef.current);
		};
	}, [notif, cancel]);

	return (
		<motion.div
			drag="x"
			dragSnapToOrigin={true}
			onDragEnd={handleDrag}
			initial={{ y: -50, opacity: 0 }}
			exit={{ x: 50, opacity: 0 }}
			animate={{ y: 0, opacity: 1, top: 25 * index }}
			className={`fixed z-50 p-3 pl-5 pb-0 rounded-lg shadow-lg
            shadow-slate-950 text-[#fff] bg-[#0a0a0a] left-10 right-10 max-w-[400px]`}
			onPointerDown={() => setCancel(true)}
		>
			{/* On click open notification settings*/}
			<button onClick={() => null}>
				<FaCog />
			</button>
			{!cancel ? (
				<motion.div
					initial={{ width: 0 }}
					animate={{
						width: "100%",
						transition: { duration: 5 }
					}}
					className={`absolute top-0 left-0 min-h-[4px] ${notif.color} rounded-l-full`}
				></motion.div>
			) : null}
			<div
				className={`absolute top-0 left-0 bottom-0 ${notif.color} w-[5px] rounded-md`}
			></div>
			<p className="text-lg font-semibold">{notif.title}</p>
			<p className="text-xs whitespace-pre-line">{notif.text}</p>
			<div className="mt-3 p-1 border-t flex justify-between items-center">
				{notif.actions.map((action: Action, index: number) => (
					<button
						key={index}
						onClick={() => action.func()}
						className="cursor-pointer hover:text-slate-300 duration-200 text-sm font-semibold"
					>
						{action.text}
					</button>
				))}
			</div>
		</motion.div>
	);
};

const SysNotif = (): JSX.Element => {
	const { notifs } = useContext(NotifCtxt);

	return notifs.map((notification: SysNotifType, index: number) => (
		<Notification notif={notification} index={index} />
	));
};

export default SysNotif;
