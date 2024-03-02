import { motion } from "framer-motion";
import { FaFingerprint, FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Home = (): JSX.Element => {
 const navigate = useNavigate();

 return (
  <main
   className="flex flex-col justify-center items-center h-screen gap-y-5
  px-10"
  >
   <FaFingerprint className="text-6xl text-secondary" />
   <button className="font-semibold text-[#fff]">Sign in with Touch ID</button>
   <p className="text-[#aaa] text-center px-2">
    Use your finger print for fast and easy access to your account
   </p>
   <motion.button
    whileTap={{ backgroundColor: "#fff" }}
    onClick={() => navigate("/login/email")}
    className="p-3 mt-20 rounded-sm shadow-lg bg-primary w-full"
   >
    Login With <MdEmail className="inline ml-1" />
   </motion.button>
   <motion.button
    whileTap={{ backgroundColor: "#fff" }}
    onClick={() => navigate("/login/phone")}
    className="p-3 mt-1 rounded-sm shadow-lg bg-primary w-full"
   >
    Login With <FaPhone className="inline ml-1" />
   </motion.button>
   <button onClick={() => navigate("/signup")} className="text-[#fff] text-center px-2">New User? Sign Up</button>
   <button className="mt-40 text-primary">Help?</button>
  </main>
 );
};

export default Home;
