import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdAccountCircle } from "react-icons/md";
import MainSettings from "./MainSettings";
import BackDrop from "../components/BackDrop";
import UserCtxt from "../context/userCtxt";
import Logout from "./Logout";

const UserMenu = (): JSX.Element => {
  const { setOpenUserMenu } = useContext(UserCtxt);
  const [title, setTitle] = useState({
    string: "Account",
    icon: <MdAccountCircle />,
  });
  const [settingsState, setSettingsState] = useState({ page: "main" });

  return (
    <>
      <BackDrop close={setOpenUserMenu} />
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        exit={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-none fixed top-[-20px] bottom-[60%] left-0 right-0 z-40 bg-gradient-to-t from-secondary to-primary rounded-b-lg flex justify-center items-start pt-20 text-4xl font-bold text-black"
      >
        <div className="flex justify-center items-center gap-x-2">
          {title.icon}
          {title.string}
        </div>
      </motion.div>
      <div className="fade-inset-black fixed z-50 top-40 bottom-[-20px] right-10 left-10 lg:left-[80%] rounded-md overflow-hidden">
        <motion.nav
          initial={{ opacity: 0, y: 100 }}
          exit={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed z-40 top-40 bottom-[-20px] right-10 left-10 lg:left-[80%] rounded-md bg-[#000] p-5 overflow-y-auto shadow-lg small-scrollbar"
        >
          <MainSettings
            setSettingsState={setSettingsState}
            setTitle={setTitle}
          />
          <AnimatePresence>
            {settingsState.page === "logout" && (
              <Logout setSettingsState={setSettingsState} setTitle={setTitle} />
            )}
          </AnimatePresence>
        </motion.nav>
      </div>
    </>
  );
};

export default UserMenu;
