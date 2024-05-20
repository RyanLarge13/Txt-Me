import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import UserCtxt from "../context/userCtxt";
import { FaSearch } from "react-icons/fa";

const Messages = () => {
  const { openChatsMenu, setOpenChatsMenu, newChat } = useContext(UserCtxt);

  const [messages, setMessages] = useState([]);
  const [userMessaged, setUserMessaged] = useState(null);

  return (
    <motion.section
      initial={{ left: "25vw" }}
      animate={{
        left: openChatsMenu ? "25vw" : "0",
        transition: { duration: 0.15 },
      }}
      className="overflow-y-auto absolute top-12 right-0 bottom-0 z-30 outline-3 outline-[#FFF] p-5 flex justify-center items-center"
    >
      {!newChat ? (
        <div className="self-start mt-5">
          {openChatsMenu ? (
            <p className="text-secondary">Choose Your Chat...</p>
          ) : (
            <div className="flex flex-col justify-center items-center gap-y-5">
              <p className="text-secondary text-center">
                Select a chat to view and send messages or create a new one
              </p>
              <button
                onClick={() => setOpenChatsMenu(true)}
                className="bg-primary w-full p-3 rounded-sm text-[#000] font-bold"
              >
                Open Chats
              </button>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={(e) => e.preventDefault()} className="self-start w-96">
          <div className="flex gap-x-3 w-full items-center">
            <input
              type="text"
              placeholder="search contacts"
              className="bg-[#222] duration-200 focus:outline-none rounded-full py-2 px-3 w-full"
            />
            <button>
              <FaSearch />
            </button>
          </div>
        </form>
      )}
    </motion.section>
  );
};

export default Messages;
