import React, { useContext } from "react";
import { motion } from "framer-motion";
import BackDrop from "../components/BackDrop";
import UserCtxt from "../context/userCtxt";

const UserMenu = (): JSX.Element => {
  const { setOpenUserMenu } = useContext(UserCtxt);

  return (
    <>
      <BackDrop close={setOpenUserMenu} />
      <motion.nav
        initial={{ opacity: 0, x: 100 }}
        exit={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed z-40 top-0 bottom-0 right-0 left-[80%] bg-[#000] p-5"
      >
        User Menu
      </motion.nav>
    </>
  );
};

export default UserMenu;
