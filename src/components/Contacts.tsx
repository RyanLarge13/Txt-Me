import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils/helpers";
import UserCtxt from "../context/userCtxt";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Contacts as ContactsType, Message } from "../types/userTypes";

const Contacts = () => {
  const { contacts, setMessageSession, setAllMessages, allMessages } =
    useContext(UserCtxt);

  const navigate = useNavigate();
  const messagesMap = new Map();

  const startMessage = (contact: ContactsType) => {
    navigate("/profile");
    const sessionMessages = messagesMap.get(contact.contactid) || [];
    setMessageSession({ contact: contact, messages: sessionMessages });
    const newSessions: Map<number, Message[]> = new Map(allMessages);
    if (newSessions.has(contact.number)) {
      newSessions.get(contact.number)?.push(sessionMessages);
    } else {
      newSessions.set(contact.number, [sessionMessages]);
    }
    setAllMessages(newSessions);
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
