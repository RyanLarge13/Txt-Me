import React from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { MdMarkEmailRead, MdOutlinePermPhoneMsg } from "react-icons/md";

const Verify = (): JSX.Element => {
 const navigate = useNavigate();
 const { type, method} = useParams();

 const handlePhoneVerify = e => {
  e.preventDefault();
 };

 const handleEmailVerify = e => {
  e.preventDefault();
 };

 return (
  <main
   className="text-[#fff] flex flex-col justify-center items-center
  h-screen gap-y-5 px-10 lg:px-80"
  >
   {type === "phone" ? (
    <>
     <MdOutlinePermPhoneMsg className="text-6xl text-secondary" />
     <p className="font-semibold text-[#fff]">One Time Passcode</p>
     <p className="text-[#aaa] text-center px-2">
      Verify your phone number with the pin sent to your phone via sms
     </p>
     <form className="mt-20 w-full" onSubmit={handlePhoneVerify}>
      <input
       autoFocus={true}
       className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
       placeholder="pin"
      />
      <motion.button
       whileTap={{ backgroundColor: "#fff" }}
       className="p-3 text-[#000] mt-2 rounded-sm shadow-lg bg-primary w-full"
       type="submit"
      >
       Verify
      </motion.button>
     </form>
    </>
   ) : (
    <>
     {" "}
     <MdMarkEmailRead className="text-6xl text-secondary" />
     <p className="font-semibold text-[#fff]">One Time Passcode</p>
     <p className="text-[#aaa] text-center px-2">
      Verify your account by inserting the pin sent to your email address
     </p>
     <form className="mt-20 w-full" onSubmit={handleEmailVerify}>
      <input
       autoFocus={true}
       className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
       placeholder="pin"
      />
      <motion.button
       whileTap={{ backgroundColor: "#fff" }}
       className="p-3 text-[#000] mt-2 rounded-sm shadow-lg bg-primary w-full"
       type="submit"
      >
       Verify
      </motion.button>
     </form>
    </>
   )}{" "}
  </main>
 );
};

export default Verify;
