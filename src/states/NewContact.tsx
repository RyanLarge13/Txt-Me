import React from "react";
import { motion } from "framer-motion";

const NewContact = (): JSX.Element => {
  return (
    <motion.section
      initial={{ opacity: 0, y: "100%" }}
      exit={{ opacity: 0, y: "100%" }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, type: "spring" },
      }}
      className="fixed inset-0 z-[999] bg-[#000]"
    >
      NewContact
    </motion.section>
  );
};

export default NewContact;
