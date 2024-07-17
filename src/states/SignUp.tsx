import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../utils/api.ts";
import { motion } from "framer-motion";
import { TiMessages } from "react-icons/ti";
import Validator from "../utils/validator.ts";
import UserCtxt from "../context/userCtxt.tsx";
import { ClipLoader } from "react-spinners";

const SignUp = (): JSX.Element => {
 const { notifHdlr, setToken } = useContext(UserCtxt);

 const [username, setUsername] = useState("");
 const [email, setEmail] = useState("");
 const [phone, setPhone] = useState("");
 const [password, setPassword] = useState("");
 const [loading, setLoading] = useState(false);

 const navigate = useNavigate();
 const validator = new Validator();

 const tryingLogin = () => {
  navigate("/login/email");
  notifHdlr.closeNotif();
 };

 const signUpNewUser = e => {
  e.preventDefault();
  setLoading(true);
  const valArr = [
   validator.valUsername(username),
   validator.valEmail(email),
   validator.valPhoneNumber(phone),
   validator.valPassword(password)
  ];
  const showError = valArr.every(validation => validation === false);
  if (showError) {
   let type;
   const firstIndex = valArr.firstIndexOf(false);
   switch (firstIndex) {
    case 0:
     type = "username"
     break;
    case 1:
     type = "email"
     break;
    case 2:
     type = "phone"
     break;
    case 3:
     type = "Password"
     break;
     default: "username"
     break;
   }
   return;
  }
  if (!isValidEmail) {
   notifHdlr.setNotif(
    "Invalid Email",
    "Please provide a valid email",
    true,
    []
   );
   setLoading(false);
   return;
  }
  if (!isValidPass) {
   notifHdlr.setNotif(
    "Invalid Password",
    "Please provide a valid password",
    true,
    []
   );
   setLoading(false);
   return;
  }
  if (!isValidUsername) {
   notifHdlr.setNotif(
    "Invalid Username",
    "Please provide a valid username",
    true,
    []
   );
   setLoading(false);
   return;
  }
  if (!isValidPhone) {
   notifHdlr.setNotif(
    "Invalid Phone",
    "Please provide a valid phone",
    true,
    []
   );
   setLoading(false);
   return;
  }
  try {
   signUp({ username, email, phone, password })
    .then(res => {
     notifHdlr.setNotif("New Account", res.data.message, true, []);
     setToken(res.data.data.token);
     localStorage.setItem("authToken", res.data.data.token);
     navigate("/verify/phone/verify");
    })
    .catch(err => {
     console.log(err);
     notifHdlr.setNotif("Error", err.response.data.message, true, [
      { text: "try login", func: (): void => tryingLogin() }
     ]);
    })
    .finally(() => {
     setLoading(false);
    });
  } catch (err) {
   console.log(err);
   notifHdlr.setNotif("Error", err.response.data.message, true, []);
   setLoading(false);
  }
 };

 return (
  <main className="text-[#fff] flex flex-col justify-center items-center h-screen gap-y-5 px-10 lg:px-80">
   <TiMessages className="text-6xl text-secondary" />
   <p className="font-semibold text-[#fff]">New Account</p>
   <p className="text-[#aaa] text-center px-2">
    Welcome to Txt Me, this should only take a few seconds
   </p>
   <form className="mt-20" onSubmit={signUpNewUser}>
    <input
     autoFocus={true}
     type="text"
     onChange={e => setUsername(e.target.value)}
     value={username}
     className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
     placeholder="Username"
    />
    <input
     type="email"
     onChange={e => setEmail(e.target.value)}
     value={email}
     className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
     placeholder="Email"
    />
    <input
     type="phone"
     onChange={e => setPhone(e.target.value)}
     value={phone}
     className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
     placeholder="(702)-981-1370"
    />
    <input
     type="password"
     onChange={e => setPassword(e.target.value)}
     value={password}
     className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
     placeholder="Password"
    />
    <motion.button
     disabled={loading}
     whileTap={{ backgroundColor: "#fff" }}
     className="p-3 text-[#000] mt-2 rounded-sm shadow-lg bg-primary w-full"
     type="submit"
    >
     {loading ? <ClipLoader size={17} color="#fff" /> : "Sign Up"}
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
