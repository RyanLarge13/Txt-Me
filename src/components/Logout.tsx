import { motion } from "framer-motion";
import React from "react";
import { MdAccountCircle } from "react-icons/md";

import { useConfig } from "../context/configContext";
import useLogger from "../hooks/useLogger";
import useNotifActions from "../hooks/useNotifActions";
import { defaultUser } from "../utils/constants";

const Logout = ({ setSettingsState, setTitle }) => {
  const { setUser } = useConfig();
  const { addSuccessNotif } = useNotifActions();

  const log = useLogger();

  const handleLogout = () => {
    try {
      localStorage.removeItem("authToken");
    } catch (err) {
      log.logAllError(
        "Error when removing authToken from localStorage when logging out.",
        err
      );
      console.log("Could not remove stored auth token");
    }
    setUser(defaultUser);

    addSuccessNotif("Logged Out", "You are now logged out", false, []);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      exit={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed z-40 top-40 bottom-[-20px] right-10 left-10 lg:left-[80%] rounded-md bg-[#000] p-5 overflow-y-auto shadow-lg small-scrollbar flex flex-col justify-center items-center"
    >
      <p className="max-w-[500px] text-gray-400">
        Are you sure you want to logout? 😶
      </p>
      <button
        onClick={handleLogout}
        className="bg-primary py-3 mt-20 text-black w-full"
      >
        Logout
      </button>
      <button
        onClick={() => {
          setTitle({ string: "Account", icon: <MdAccountCircle /> });
          setSettingsState({ page: "main" });
        }}
        className="bg-secondary py-3 mt-5 text-black w-full"
      >
        Cancel
      </button>
    </motion.div>
  );
};

export default Logout;
