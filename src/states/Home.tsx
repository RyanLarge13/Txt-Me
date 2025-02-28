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
import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Home = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col justify-center items-center h-screen gap-y-5 px-10 lg:px-80">
      <h1 className="text-6xl text-secondary">Txt Me</h1>
      <button className="font-semibold text-white">Welcome</button>
      <p className="text-gray-400 text-center px-2">
        Stay connected through the internet via the most powerful messaging
        platform available
      </p>
      <motion.button
        whileTap={{ backgroundColor: "#fff" }}
        whileHover={{ backgroundColor: "#ef63ff" }}
        onClick={() => navigate("/login/email")}
        className="p-3 mt-20 rounded-sm shadow-lg bg-primary w-full max-w-[400px]"
      >
        Login With <MdEmail className="inline ml-1" />
      </motion.button>
      <motion.button
        whileTap={{ backgroundColor: "#fff" }}
        whileHover={{ backgroundColor: "#ef63ff" }}
        onClick={() => navigate("/login/phone")}
        className="p-3 mt-1 rounded-sm shadow-lg bg-primary w-full max-w-[400px]"
      >
        Login With <FaPhone className="inline ml-1" />
      </motion.button>
      <button
        onClick={() => navigate("/signup")}
        className="text-white text-center px-2"
      >
        New User? Sign Up
      </button>
      <button className="mt-40 text-primary" onClick={() => navigate("/help")}>
        Help?
      </button>
    </main>
  );
};

export default Home;
