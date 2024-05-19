import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import UserCtxt from "../context/userCtxt";

const Messages = () => {
  const { openChatsMenu, setOpenChatsMenu } = useContext(UserCtxt);

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
      {!userMessaged ? (
        <div className="self-start mt-5">
          {openChatsMenu ? (
            <p className="text-secondary">Choose Your Chat...</p>
          ) : (
            <div className="flex flex-col justify-center items-center gap-y-5">
              <p className="text-secondary">
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
      ) : null}
    </motion.section>
  );
};

export default Messages;
