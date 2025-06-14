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
import React, { useContext, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Outlet } from "react-router-dom";

import SearchIcon from "../assets/search.svg";
import InteractiveCtxt from "../context/interactiveCtxt.tsx";
import UserCtxt from "../context/userCtxt.tsx";
import { Contacts as ContactType } from "../types/userTypes.ts";
import Contacts from "./Contacts.tsx";

/*
  TODO:
    IMPLEMENT:
      1. Important to change this component. We are re-rendering
      too often and the code is confusing. You have both a contact search by name
      and a contact search by number one in the parent one
      in the child component causing too much confusion
*/
const ContactsComponent = () => {
  const { openChatsMenu } = useContext(InteractiveCtxt);
  const { contacts } = useContext(UserCtxt);

  const [noFoundContacts, setNoFoundContact] = useState<boolean>(false);
  const [searchedContacts, setSearchedContacts] =
    useState<ContactType[]>(contacts);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    if (searchText === "") {
      setSearchedContacts(contacts);
      setNoFoundContact(false);
    } else {
      const foundContacts = contacts.filter((c: ContactType) =>
        c.name.toLowerCase().includes(searchText.toLowerCase())
      );

      if (foundContacts.length < 1) {
        setSearchedContacts([]);
        setNoFoundContact(true);
      } else {
        setSearchedContacts(foundContacts);
        setNoFoundContact(false);
      }
    }
  }, [searchText, noFoundContacts]);

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
        <form className="w-full" onSubmit={(e) => e.preventDefault()}>
          <div className="flex gap-x-3 w-full items-center">
            <input
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
              placeholder="Search Contacts"
              className="bg-[#222] duration-200  outline-none focus:outline-none rounded-full py-2 px-3 w-full"
            />
            <button type="submit">
              <FaSearch />
            </button>
          </div>
        </form>
        <AnimatePresence>
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
          ) : (
            <Contacts contacts={searchedContacts} />
          )}
        </AnimatePresence>
      </div>
      <Outlet />
    </motion.section>
  );
};

export default ContactsComponent;
