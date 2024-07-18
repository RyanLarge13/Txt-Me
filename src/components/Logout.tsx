import React, { useContext } from "react";
import { motion } from "framer-motion";
import { MdAccountCircle } from "react-icons/md";
import UserCtxt from "../context/userCtxt";

const Logout = ({ setSettingsState, setTitle }) => {
  const { setUser, setToken, notifHdlr } = useContext(UserCtxt);

  const handleLogout = () => {
    try {
      localStorage.removeItem("authToken");
    } catch (err) {
      console.log("Could not remove stored auth token");
    }
    setUser({
      username: "",
      userId: 0,
      email: "",
      phoneNumber: "",
    });
    setToken("");
    notifHdlr.setNotif(
      "Logged Out",
      "You have successfully logged out. Hope to see you again soon!",
      true,
      []
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      exit={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed z-40 top-40 bottom-[-20px] right-10 left-10 lg:left-[80%] rounded-md bg-[#000] p-5 overflow-y-auto shadow-lg small-scrollbar flex flex-col justify-center items-center"
    >
      <p className="max-w-[500px] text-gray-400">
        Are you sure you want to logout?
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
