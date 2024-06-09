import React from "react";
import { motion } from "framer-motion";
import { FaCamera, FaUser } from "react-icons/fa";

const NewContact = (): JSX.Element => {
 return (
  <motion.section
   initial={{ opacity: 0, y: "100%" }}
   exit={{ opacity: 0, y: "100%" }}
   animate={{
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, type: "spring" }
   }}
   className="fixed inset-0 z-[999] bg-[#000] "
  >
   <div>
    <div className="flex justify-center items-center h-40 pt-20">
     <label
      className="rounded-full w-40 h-40 flex justify-center
     items-center bg-[#111]"
     >
      <input type="file" className="hidden" />
      <FaCamera className="text-2xl text-primary" />
     </label>
    </div>
    <div className="mt-40 px-5">
     <div className="flex gap-x-5 justify-start items-center w-full p-2 my-3 rounded-sm shadow-sm shadow-secondary">
      <FaUser />
      <input type="text" placeholder="Name" />
     </div>
     <input
      type="text"
      placeholder="Nickname"
      className="w-full p-2 my-3 rounded-sm
    bg-[#000] shadow-sm shadow-secondary"
     />
     <input
      type="text"
      placeholder="Mobile"
      className="w-full p-2 my-3 rounded-sm
    bg-[#000] shadow-sm shadow-secondary"
     />
     <input
      type="email"
      placeholder="Email"
      className="w-full p-2 my-3 rounded-sm
    bg-[#000] shadow-sm shadow-secondary"
     />
     <input
      type="text"
      placeholder="Address"
      className="w-full p-2 my-3 rounded-sm
    bg-[#000] shadow-sm shadow-secondary"
     />
     <input
      type="text"
      placeholder="Website"
      className="w-full p-2 my-3 rounded-sm
    bg-[#000] shadow-sm shadow-secondary"
     />
     <input
      type="text"
      placeholder="Relationship"
      className="w-full p-2 my-3 rounded-sm
    bg-[#000] shadow-sm shadow-secondary"
     />
    </div>
   </div>
  </motion.section>
 );
};

export default NewContact;
