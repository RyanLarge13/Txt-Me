import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../utils/api.ts";
import { motion } from "framer-motion";
import { TiMessages } from "react-icons/ti";

const SignUp = (): JSX.Element => {
 const [loading, setLoading] = useState(false);
 const [username, setUsername] = useState("");
 const [email, setEmail] = useState("");
 const [phone, setPhone] = useState("");
 const [password, setPassword] = useState("");

 const navigate = useNavigate();

 const signUpNewUser = e => {
  e.preventDefault();
  try {
   signUp({ username, email, phone, password }).then((res) => {}).catch((err) =>
   {
    console.log(err)
   });
  } catch (err) {
   console.log(err);
  }
 };

 return (
  <main className="text-[#fff] flex flex-col justify-center items-center h-screen gap-y-5 px-10">
   <TiMessages className="text-6xl text-secondary" />
   <p className="font-semibold text-[#fff]">New Account</p>
   <p className="text-[#aaa] text-center px-2">
    Welcome to Txt Me, this should only take a few seconds
   </p>
   <form className="mt-20" onSubmit={e => signUpNewUser(e)}>
    <input
     autofocus="true"
     type="username"
     onChange={e => setUsername(e.target.value)}
     className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
     placeholder="Username"
    />
    <input
     type="email"
     onChange={e => setEmail(e.target.value)}
     className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
     placeholder="Email"
    />
    <input
     type="phone"
     onChange={e => setPhone(e.target.value)}
     className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
     placeholder="(702)-981-1370"
    />
    <input
     type="password"
     onChange={e => setPassword(e.target.value)}
     className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
     placeholder="Password"
    />
    <motion.button
     whileTap={{ backgroundColor: "#fff" }}
     className="p-3 text-[#000] mt-2 rounded-sm shadow-lg bg-primary w-full"
     type="submit"
    >
     Sign Up
    </motion.button>
   </form>
   <button
    onClick={() => navigate("/login/email")}
    className="text-[#fff] text-center px-2"
   >
    Have An Account? Login
   </button>
  </main>
 );
};

export default SignUp;
