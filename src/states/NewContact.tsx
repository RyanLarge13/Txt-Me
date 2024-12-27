import React, { motion } from "framer-motion";
import {
  FaAddressCard,
  FaCamera,
  FaLink,
  FaUser,
  FaUserTag,
} from "react-icons/fa";
import { FaMobileScreen } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const NewContact = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: "100%" }}
      exit={{ opacity: 0, y: "100%" }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, type: "spring" },
      }}
      className="fixed inset-0 z-[999] bg-[#000] overflow-y-auto small-scrollbar"
    >
      <div className="flex justify-center items-center h-40 pt-20">
        <label
          className="rounded-full w-40 h-40 flex justify-center
     items-center bg-[#111] cursor-pointer"
        >
          <input type="file" className="hidden" />
          <FaCamera className="text-2xl text-primary" />
        </label>
      </div>
      <div className="mt-40 px-5">
        <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
          <FaUser />
          <input
            type="text"
            className="bg-[#000] focus:outline-none"
            placeholder="Name"
          />
        </div>
        <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
          <FaUserTag />
          <input
            type="text"
            className="bg-[#000] focus:outline-none"
            placeholder="Nickname"
          />
        </div>
        <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
          <FaMobileScreen />
          <input
            type="text"
            className="bg-[#000] focus:outline-none"
            placeholder="Mobile"
          />
        </div>
        <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
          <MdEmail />
          <input
            type="text"
            className="bg-[#000] focus:outline-none"
            placeholder="Email"
          />
        </div>
        <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
          <FaAddressCard />
          <input
            type="text"
            className="bg-[#000] focus:outline-none"
            placeholder="Address"
          />
        </div>
        <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
          <FaLink />
          <input
            type="text"
            className="bg-[#000] focus:outline-none"
            placeholder="Website"
          />
        </div>
      </div>
      <div className="flex justify-evenly items-center mb-10 mt-20">
        <button
          className="bg-secondary px-10 py-3 flex-[0.25] text-[#000]"
          onClick={() => navigate("/profile/contacts")}
        >
          Cancel
        </button>
        <button className="bg-primary flex-[0.25] px-10 py-3 text-[#000]">
          Save
        </button>
      </div>
    </motion.section>
  );
};

export default NewContact;
