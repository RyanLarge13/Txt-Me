import React from "react";
import { motion } from "framer-motion";

const ChatsMenu = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, x: -100 }}
      exit={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex fixed top-12 left-0 right-0 md:right-[75%] z-40 bottom-0 overflow-y-auto bg-[#000]"
    >
      <div className="sticky top-40 w-full">
        <button className="bg-primary w-full p-3 rounded-sm text-[#000]">
          New Chat
        </button>
      </div>
    </motion.nav>
  );
};

export default ChatsMenu;
