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

import UserCtxt from "../context/userCtxt";
import { AllMessages, Contacts as ContactsType } from "../types/userTypes";
import { getInitials } from "../utils/helpers";

const Contacts = () => {
  const { contacts, setMessageSession, setAllMessages, allMessages } =
    useContext(UserCtxt);

  const navigate = useNavigate();
  const messagesMap = new Map();

  const startMessage = (contact: ContactsType) => {
    const sessionMessages = messagesMap.get(contact.contactid) || [];

    setMessageSession({ contact: contact, messages: sessionMessages });

    const newSessionMap: AllMessages = new Map(allMessages);

    const newMessageSession = { contact: contact, messages: sessionMessages };

    newSessionMap.set(contact.number, newMessageSession);

    setAllMessages(newMessageSession.messages);

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
        contacts.map((contact) => (
          <div
            key={contact.contactid}
            onClick={() => startMessage(contact)}
            className="flex justify-between items-center py-5 bg-black"
          >
            {contact.avatar ? (
              <img
                src={contact.avatar}
                alt="avatar"
                width={30}
                height={30}
                className="w-[30px] h-[30px] rounded-full object-contain"
              />
            ) : (
              <p className="flex justify-center items-center w-[40px] h-[40px] text-black rounded-full bg-slate-400">
                {getInitials(contact.name)}
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
