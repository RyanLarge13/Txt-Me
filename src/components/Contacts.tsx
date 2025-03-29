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
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import { useDatabase } from "../context/dbContext";
import UserCtxt from "../context/userCtxt";
import useLogger from "../hooks/useLogger";
import {
  Contacts as ContactsType,
  MessageSessionType,
} from "../types/userTypes";
import { getInitials } from "../utils/helpers";

const Contacts = () => {
  const { contacts, allMessages, setMessageSession, setAllMessages } =
    useContext(UserCtxt);
  const { IDB_UpdateMessageSession } = useDatabase();

  const navigate = useNavigate();
  const log = useLogger();

  // You have the same member function in/for ChatsMenu.tsx
  // Consider adding it to a common utils file or helper
  const M_StoreSession = async (
    newSession: MessageSessionType
  ): Promise<void> => {
    try {
      await IDB_UpdateMessageSession(newSession);
    } catch (err) {
      log.logAllError(
        "Error saving new session to indexedDB when clicking contact",
        err
      );
    }
  };

  const M_StartMessage = (contact: ContactsType) => {
    const newSessionDefault: MessageSessionType = {
      number: contact.number,
      contact: contact,
      messages: [],
    };

    if (allMessages.has(contact.number)) {
      // Immediately set message session to the contact stored and messages found
      // and nothing else
      newSessionDefault.messages =
        allMessages.get(contact.number)?.messages || [];
      setMessageSession(newSessionDefault);
    } else {
      // First update our map and then create the message session
      allMessages.set(contact.number, {
        contact: contact,
        messages: [],
      });

      setAllMessages(new Map(allMessages));
      setMessageSession(newSessionDefault);
    }

    M_StoreSession(newSessionDefault);

    navigate("/profile");
  };

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      exit={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mt-20 w-full"
    >
      <button
        onClick={() => navigate("/profile/newcontact")}
        className="bg-primary text-[#000] p-3 w-full rounded-sm"
      >
        New Contact
      </button>
      {contacts.length > 0 ? (
        contacts.map((contact: ContactsType) => (
          <div
            key={contact.contactid}
            onClick={() => M_StartMessage(contact)}
            className="flex justify-between items-center py-5 bg-black"
          >
            {contact.avatar ? (
              <img
                src={contact?.avatar}
                alt="avatar"
                width={30}
                height={30}
                className="w-[30px] h-[30px] rounded-full object-contain"
              />
            ) : (
              <p className="flex justify-center items-center w-[40px] h-[40px] text-black rounded-full bg-slate-400">
                {getInitials(contact.name || "")}
              </p>
            )}
            <p>{contact.name}</p>
            <BsThreeDotsVertical />
          </div>
        ))
      ) : (
        <p className="text-center mt-10">No Contacts</p>
      )}
    </motion.div>
  );
};

export default Contacts;
