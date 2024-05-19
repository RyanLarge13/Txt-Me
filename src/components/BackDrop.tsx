import React, { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";

type Props = {
  close: Dispatch<SetStateAction<boolean>>;
};

function BackDrop({ close }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={(): void => close(false)}
      className="fixed inset-0 z-40 backdrop-blur-sm bg-opacity-40"
    ></motion.div>
  );
}

export default BackDrop;
