import React, { useContext } from "react";
import { motion } from "framer-motion";
import UserCtxt from "../context/userCtxt";
import { useNavigate } from "react-router-dom";

const ChatsMenu = () => {
  const { setMessageSession } = useContext(UserCtxt);

  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ opacity: 0, x: -100 }}
      exit={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex fixed top-14 left-0 right-0 md:right-[75%] z-40 bottom-0
      overflow-y-auto bg-[#000]"
    >
      <div className="sticky top-40 mx-5 w-full">
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
    </motion.nav>
  );
};

export default ChatsMenu;
