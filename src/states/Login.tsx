import { motion } from "framer-motion";
import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";

const Login = (): JSX.Element => {
 const { type } = useParams();
 const navigate = useNavigate();

 return (
  <main className="text-[#fff] flex flex-col justify-center items-center h-screen gap-y-5 px-10">
   {type === "email" ? (
    <>
     <MdEmail className="text-6xl text-secondary" />
     <p className="font-semibold text-[#fff]">Traditional Login</p>
     <p className="text-[#aaa] text-center px-2">
      Use your email and password to securely login
     </p>
     <form className="mt-20">
      <input
       autofocus="true"
       type="username"
       className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
       placeholder="Username"
      />
      <input
       type="email"
       className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
       placeholder="Email"
      />
      <input
       type="password"
       className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
       placeholder="Password"
      />
      <motion.button
       whileTap={{ backgroundColor: "#fff" }}
       className="p-3 text-[#000] mt-2 rounded-sm shadow-lg bg-primary w-full"
       type="submit"
      >
       Login
      </motion.button>
     </form>
     <motion.button
      whileTap={{ backgroundColor: "#fff" }}
      onClick={() => navigate("/login/phone")}
      className="p-3 mt-1 rounded-sm shadow-lg text-[#000] bg-tri w-full"
     >
      Login With <FaPhone className="inline ml-1" />
     </motion.button>
     <button
      onClick={() => navigate("/signup")}
      className="text-[#fff] text-center px-2"
     >
      New User? Sign Up
     </button>
    </>
   ) : (
    <>
     <FaPhone className="text-6xl text-secondary" />
     <p className="font-semibold text-[#fff]">Login with your phone number</p>
     <p className="text-[#aaa] text-center px-2">
      Use your phone number to login to your account securely and easily
     </p>
     <form className="mt-20 w-full">
      <input
       autofocus="true"
       type="phone"
       className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
       placeholder="(702)-981-1370"
      />
      <motion.button
       whileTap={{ backgroundColor: "#fff" }}
       className="p-3 text-[#000] mt-2 rounded-sm shadow-lg bg-primary w-full"
       type="submit"
      >
       Login
      </motion.button>
     </form>
     <motion.button
      whileTap={{ backgroundColor: "#fff" }}
      onClick={() => navigate("/login/email")}
      className="p-3 mt-1 rounded-sm shadow-lg text-[#000] bg-tri w-full"
     >
      Login With <MdEmail className="inline ml-1" />
     </motion.button>
     <button
      onClick={() => navigate("/signup")}
      className="text-[#fff] text-center px-2"
     >
      New User? Sign Up
     </button>
    </>
   )}
  </main>
 );
};

export default Login;
