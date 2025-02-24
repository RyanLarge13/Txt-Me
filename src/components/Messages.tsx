import React, { ChangeEvent, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import SearchIcon from "../assets/search.svg";
import UserCtxt from "../context/userCtxt";
import Contacts from "./Contacts.tsx";

const Messages = () => {
  const { openChatsMenu } = useContext(UserCtxt);

  const [noFoundContacts, setNoFoundContact] = useState(false);

  const searchContacts = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value.length < 1) {
      setNoFoundContact(false);
      return;
    }
    const contactsFound = [];
    if (contactsFound.length < 1) {
      setNoFoundContact(true);
    } else {
      setNoFoundContact(false);
    }
  };

  return (
    <motion.section
      initial={{ left: "25vw" }}
      animate={{
        left: openChatsMenu ? "25vw" : "0",
        transition: { duration: 0.15 },
      }}
      className="overflow-y-auto absolute top-12 right-0 bottom-0 z-30 outline-3 bg-black outline-[#FFF] p-5 flex justify-center items-center"
    >
      <div className="flex h-full w-full flex-col justify-start items-center">
        <form className="w-full">
          <div className="flex gap-x-3 w-full items-center">
            <input
              onChange={searchContacts}
              type="text"
              placeholder="Search Contacts"
              className="bg-[#222] duration-200  outline-none focus:outline-none rounded-full py-2 px-3 w-full"
            />
            <button>
              <FaSearch />
            </button>
          </div>
        </form>
        <AnimatePresence>
          <Contacts />
          {noFoundContacts && (
            <>
              <img
                src={SearchIcon}
                alt="search-icon"
                className="rounded-md w-40 h-40 shadow-md object-contain mt-20"
              />
              <p className="mt-5 text-gray-400 max-w-80 text-center">
                Sorry, no contacts were returned from your search
              </p>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default Messages;
