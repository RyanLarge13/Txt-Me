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

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useConfig } from "../context/configContext.tsx";
import useNotifActions from "../hooks/useNotifActions.ts";
import useNotifState from "../hooks/useNotifState.ts";
import { Actions, SysNotifType } from "../types/notifTypes.ts";

const NotifSettingsButton = (): JSX.Element => {
  const { getUserData } = useConfig();

  const user = getUserData("userId");

  const navigate = useNavigate();

  return (
    <>
      {user ? (
        <button
          onClick={() => navigate("/account")}
          className="absolute top-2 right-3"
        >
          <FaCog />
        </button>
      ) : null}
    </>
  );
};

const Notification = ({ notif }): JSX.Element => {
  const { removeNotif } = useNotifActions();

  const [cancel, setCancel] = useState(notif.hasCancel);

  const notifTimeoutRef = useRef(setTimeout(() => {}));

  const handleDrag = (e): void => {
    const end = e.clientX;
    const minDistance = window.innerWidth / 1.4;
    if (end > minDistance) {
      removeNotif(notif.id);
    }
  };

  useEffect(() => {
    if (cancel === false) {
      notifTimeoutRef.current = setTimeout(() => {
        removeNotif(notif.id);
      }, 5000);
    } else {
      clearTimeout(notifTimeoutRef.current);
      notifTimeoutRef.current = setTimeout(() => {});
    }
    return () => {
      clearTimeout(notifTimeoutRef.current);
    };
  }, [notif, cancel, removeNotif]);

  return (
    <motion.div
      drag="x"
      dragSnapToOrigin={true}
      onDragEnd={handleDrag}
      initial={{ x: -50, opacity: 0 }}
      layout
      exit={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`p-3 pl-5 pb-0 rounded-lg shadow-lg my-3
            shadow-slate-950 text-[#fff] bg-[#0a0a0a] w-full relative`}
      onPointerDown={() => setCancel(true)}
    >
      {/* On click open notification settings. Possibly add routes for nested user settings in user menu?*/}
      <NotifSettingsButton />
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

const SysNotif = React.memo((): JSX.Element => {
  const { notifs } = useNotifState();

  return (
    <div className="fixed z-[1000] top-0 left-3 right-0 padding-3 bg-transparent max-w-[400px]">
      <AnimatePresence mode="popLayout">
        {notifs.map((notification: SysNotifType) => (
          <Notification key={notification.id} notif={notification} />
        ))}
      </AnimatePresence>
    </div>
  );
});

export default SysNotif;
