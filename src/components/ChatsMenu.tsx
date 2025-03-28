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

import { motion } from "framer-motion";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import UserCtxt from "../context/userCtxt";
import useLogger from "../hooks/useLogger";
import { Contacts, Message } from "../types/userTypes";

const ChatsMenu = () => {
  const { setMessageSession, allMessages } = useContext(UserCtxt);

  const navigate = useNavigate();
  const log = useLogger();

  const createMessageSession = (
    fromNumber: string,
    session: {
      contact: Contacts | null;
      messages: Message[];
    }
  ): void => {
    const contact = session.contact;
    const messages = session.messages;

    if (!contact) {
      log.devLog("No contact for this message session");
    }

    setMessageSession({
      number: contact?.number || fromNumber,
      contact: contact !== null ? contact : null,
      messages: messages,
    });
    navigate("/profile");
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: -100 }}
      exit={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col fixed top-14 left-0 right-0 md:right-[75%] z-40 bottom-0
      overflow-y-auto bg-[#000]"
    >
      <div className="sticky top-20 mx-5 right-0 left-0">
        <button
          onClick={() => {
            setMessageSession(null);
            navigate("/profile/contacts");
          }}
          className="bg-primary p-3 rounded-sm w-full mt-5 text-[#000]"
        >
          New Chat
        </button>
      </div>
      <div className="text-white w-full h-full">
        {Array.from(allMessages).map(([fromNumber, messageSession]) => (
          <div
            key={fromNumber}
            onClick={() => createMessageSession(fromNumber, messageSession)}
            className="flex justify-between items-center relative outline-1 outline outline-red-300"
          >
            <div className="rounded-full w-30 h-30 flex justify-center items-center">
              <p className="text-xl">
                {messageSession.contact
                  ? messageSession.contact.name[0].toUpperCase()
                  : fromNumber}
              </p>
            </div>
            <p>{messageSession?.contact?.nickname || ""}</p>
            <p className="absolute top-1 right-1">
              {new Date(
                messageSession.messages[messageSession.messages.length - 1]
                  ?.sentat || new Date()
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                dayPeriod: "short",
              })}
            </p>
          </div>
        ))}
      </div>
    </motion.nav>
  );
};

export default ChatsMenu;
