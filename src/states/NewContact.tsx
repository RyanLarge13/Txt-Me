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

import React, { motion } from "framer-motion";
import { FormEvent } from "react";
import {
  FaAddressCard,
  FaCamera,
  FaLink,
  FaUser,
  FaUserTag,
} from "react-icons/fa";
import { FaMobileScreen } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const NewContact = (): JSX.Element => {
  const navigate = useNavigate();

  const addContact = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: "100%" }}
      exit={{ opacity: 0, y: "100%" }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, type: "spring" },
      }}
      className="fixed inset-0 z-[999] bg-[#000] overflow-y-auto small-scrollbar"
    >
      <form onSubmit={addContact}>
        <div className="flex justify-center items-center h-40 pt-20">
          <label
            className="rounded-full w-40 h-40 flex justify-center
     items-center bg-[#111] cursor-pointer"
          >
            <input type="file" className="hidden" />
            <FaCamera className="text-2xl text-primary" />
          </label>
        </div>
        <div className="mt-40 px-5">
          <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
            <FaUser />
            <input
              type="text"
              className="bg-[#000] focus:outline-none"
              placeholder="Name"
            />
          </div>
          <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
            <FaUserTag />
            <input
              type="text"
              className="bg-[#000] focus:outline-none"
              placeholder="Nickname"
            />
          </div>
          <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
            <FaMobileScreen />
            <input
              type="tel"
              className="bg-[#000] focus:outline-none"
              placeholder="Mobile"
            />
          </div>
          <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
            <MdEmail />
            <input
              type="email"
              className="bg-[#000] focus:outline-none"
              placeholder="Email"
            />
          </div>
          <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
            <FaAddressCard />
            <input
              type="text"
              className="bg-[#000] focus:outline-none"
              placeholder="Address"
            />
          </div>
          <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
            <FaLink />
            <input
              type="url"
              className="bg-[#000] focus:outline-none"
              placeholder="Website"
            />
          </div>
        </div>
        <div className="flex justify-evenly items-center mb-10 mt-20">
          <button
            type="button"
            className="bg-secondary px-10 py-3 flex-[0.25] text-[#000]"
            onClick={() => navigate("/profile/contacts")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary flex-[0.25] px-10 py-3 text-[#000]"
          >
            Save
          </button>
        </div>
      </form>
    </motion.section>
  );
};

export default NewContact;
