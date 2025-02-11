import React, { motion } from "framer-motion";
import { useContext, useEffect } from "react";
import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import NotifCtxt from "../context/notifCtxt";

const Home = (): JSX.Element => {
  const navigate = useNavigate();

  const { addSuccessNotif } = useContext(NotifCtxt);

  useEffect(() => {
    addSuccessNotif("Test", "this is a test", true, []);
  }, []);

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
        onClick={() => navigate("/login/email")}
        className="p-3 mt-20 rounded-sm shadow-lg bg-primary w-full"
      >
        Login With <MdEmail className="inline ml-1" />
      </motion.button>
      <motion.button
        whileTap={{ backgroundColor: "#fff" }}
        onClick={() => navigate("/login/phone")}
        className="p-3 mt-1 rounded-sm shadow-lg bg-primary w-full"
      >
        Login With <FaPhone className="inline ml-1" />
      </motion.button>
      <button
        onClick={() => navigate("/signup")}
        className="text-white text-center px-2"
      >
        New User? Sign Up
      </button>
      <button className="mt-40 text-primary">Help?</button>
    </main>
  );
};

export default Home;
