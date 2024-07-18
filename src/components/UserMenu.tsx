import React, { useContext } from "react";
import { motion } from "framer-motion";
import { IoIosArrowForward } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import BackDrop from "../components/BackDrop";
import UserCtxt from "../context/userCtxt";

const UserMenu = (): JSX.Element => {
  const { setOpenUserMenu, user } = useContext(UserCtxt);

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
          <MdAccountCircle />
          <h2>Account</h2>
        </div>
      </motion.div>
      <div className="fade-inset-black fixed z-50 top-40 bottom-[-20px] right-10 left-10 lg:left-[80%] rounded-md overflow-hidden">
        <motion.nav
          initial={{ opacity: 0, y: 100 }}
          exit={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed z-40 top-40 bottom-[-20px] right-10 left-10 lg:left-[80%] rounded-md bg-[#000] p-5 overflow-y-auto shadow-lg small-scrollbar"
        >
          <div className="mb-10 pb-5 border-b-gray-400 border-b">
            <p>{user?.username}</p>
          </div>
          <div className="p-3">
            <p className="text-gray-400 mt-5">Account Settings</p>
            <button className="flex justify-between items-center py-3 my-3 w-full">
              Edit Profile
              <IoIosArrowForward />
            </button>
            <button className="flex justify-between items-center py-3 my-3 w-full">
              Change Username
              <IoIosArrowForward />
            </button>
            <button className="flex justify-between items-center py-3 my-3 w-full">
              Edit Profile
              <IoIosArrowForward />
            </button>
          </div>
          <div className="border-b-gray-400 border-b"></div>
          <div className="p-3">
            <p className="text-gray-400 mt-5">More</p>
            <button className="flex justify-between items-center py-3 my-3 w-full">
              About Txt Me
              <IoIosArrowForward />
            </button>
            <button className="flex justify-between items-center py-3 my-3 w-full">
              Privacy Policy
              <IoIosArrowForward />
            </button>
            <button className="flex justify-between items-center py-3 my-3 w-full">
              Terms Of Service
              <IoIosArrowForward />
            </button>
          </div>
          <div className="border-b-gray-400 border-b"></div>
          <div className="p-3">
            <p className="text-gray-400 mt-5">Manage Account</p>
            <button className="flex justify-between items-center py-3 my-3 w-full">
              Report A Problem
              <IoIosArrowForward />
            </button>
            <button className="flex justify-between items-center py-3 my-3 w-full">
              Incognito
              <IoIosArrowForward />
            </button>
            <button className="flex justify-between items-center py-3 my-3 w-full text-red-400">
              Delete Account
              <IoIosArrowForward />
            </button>
          </div>
        </motion.nav>
      </div>
    </>
  );
};

export default UserMenu;
