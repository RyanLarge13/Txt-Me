import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { MdMarkEmailRead, MdOutlinePermPhoneMsg } from "react-icons/md";
import { verifyPhone, verifyEmail } from "../utils/api";
import { ClipLoader } from "react-spinners";
import UserCtxt from "../context/userCtxt.tsx";

const Verify = (): JSX.Element => {
 const { notifHdlr, token } = useContext(UserCtxt);
 const { type, method } = useParams();
 const navigate = useNavigate();

 const [pin, setPin] = useState("");
 const [emailPin, setEmailPin] = useState("");
 const [loading, setLoading] = useState(false);

 const tryingLogin = (): void => {};

 const forgotCreds = (): void => {};

 const handlePhoneVerify = e => {
  e.preventDefault();
  setLoading(true);
  try {
   verifyPhone(token, pin)
    .then(res => {
     console.log(res);
     notifHdlr.setNotif("Verified", res.data.message, true, []);
     setLoading(false);
     navigate("/verify/email/verify");
    })
    .catch(err => {
     console.log(err);
     notifHdlr.setNotif("Error", err.response.data.message, true, [
      { text: "try login", func: (): void => tryingLogin() },
      { text: "forgot creds", func: (): void => forgotCreds() }
     ]);
     setLoading(false);
    });
  } catch (err) {
   console.log(err);
   notifHdlr.setNotif(
    "Error",
    "Please reload the application and try again. If this issue persists, contact the developer at ryanlarge@ryanlarge.dev",
    true,
    []
   );
   setLoading(false);
  }
 };

 const handleEmailVerify = e => {
  e.preventDefault();
  setLoading(true);
  try {
   verifyEmail(token, emailPin)
    .then(res => {
     console.log(res);
     notifHdlr.setNotif("Verified", res.data.message, true, []);
     setLoading(false);
     navigate("/profile");
    })
    .catch(err => {
     console.log(err);
     notifHdlr.setNotif("Error", err.response.data.message, true, [
      { text: "try login", func: (): void => tryingLogin() }
     ]);
     setLoading(false);
    });
  } catch (err) {
   console.log(err);
   notifHdlr.setNotif(
    "Error",
    "Please reload the application and try again. If this issue persists, contact the developer at ryanlarge@ryanlarge.dev",
    true,
    []
   );
   setLoading(false);
  }
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
     <form
      className="mt-20 w-full"
      onSubmit={e => {
       if (method === "verify") {
        handlePhoneVerify(e);
       }
       return;
      }}
     >
      <input
       autoFocus={true}
       value={pin}
       onChange={e => setPin(e.target.value)}
       className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
       placeholder="6 digit pin"
      />
      <motion.button
       disabled={loading}
       whileTap={{ backgroundColor: "#fff" }}
       className="p-3 text-[#000] mt-2 rounded-sm shadow-lg bg-primary w-full"
       type="submit"
      >
       {loading ? <ClipLoader size={17} color="#fff" /> : "Verify"}
      </motion.button>
     </form>
    </>
   ) : (
    <>
     <MdMarkEmailRead className="text-6xl text-secondary" />
     <p className="font-semibold text-[#fff]">One Time Pass Code</p>
     <p className="text-[#aaa] text-center px-2">
      Verify your account by inserting the pin sent to your email address
     </p>
     <form
      className="mt-20 w-full"
      onSubmit={e => {
       if (method === "verify") {
        handleEmailVerify(e);
       }
       return;
      }}
     >
      <input
       autoFocus={true}
       className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
       placeholder="pin"
       value={emailPin}
       onChange={e => setEmailPin(e.target.value)}
      />
      <motion.button
      disabled={loading} 
       whileTap={{ backgroundColor: "#fff" }}
       className="p-3 text-[#000] mt-2 rounded-sm shadow-lg bg-primary w-full"
       type="submit"
      >
       {loading ? <ClipLoader size={17} color="#fff" /> : "Verify"}
      </motion.button>
     </form>
    </>
   )}
  </main>
 );
};

export default Verify;
