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
import React, { ChangeEvent, useContext, useState } from "react";
import { FaSearch } from "react-icons/fa";

import SearchIcon from "../assets/search.svg";
import InteractiveCtxt from "../context/interactiveCtxt.tsx";
import Contacts from "./Contacts.tsx";

const Messages = () => {
  const { openChatsMenu } = useContext(InteractiveCtxt);

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
          {noFoundContacts ? (
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
          ) : null}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default Messages;
