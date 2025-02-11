import { motion } from "framer-motion";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaCog } from "react-icons/fa";

import NotifCtxt from "../context/notifCtxt.tsx";
import { Actions, SysNotifType } from "../types/notifTypes.ts";

const Notification = ({ notif, index }): JSX.Element => {
  const { removeNotif } = useContext(NotifCtxt);

  const [cancel, setCancel] = useState(notif.hasCancel);

  const notifTimeoutRef = useRef(0);

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
      // clearTimeout(notifTimeoutRef.current);
    };
  }, [notif, cancel]);

  return (
    <motion.div
      drag="x"
      dragSnapToOrigin={true}
      onDragEnd={handleDrag}
      initial={{ x: -50, opacity: 0 }}
      exit={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`p-3 pl-5 pb-0 rounded-lg shadow-lg my-3
            shadow-slate-950 text-[#fff] bg-[#0a0a0a] w-full relative`}
      onPointerDown={() => setCancel(true)}
    >
      {/* On click open notification settings*/}
      <button onClick={() => null} className="absolute top-2 right-3">
        <FaCog />
      </button>
      {!cancel ? (
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: "100%",
            transition: { duration: 5 },
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
        {notif.actions.map((action: Actions, index: number) => (
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

  return (
    <div className="fixed z-50 top-0 left-3 right-0 padding-3 bg-transparent max-w-[400px]">
      {notifs.map((notification: SysNotifType, index: number) => (
        <Notification
          key={notification.id}
          notif={notification}
          index={index}
        />
      ))}
    </div>
  );
};

export default SysNotif;
