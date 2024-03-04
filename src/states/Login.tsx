import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPhone } from "react-icons/fa";
import { GrMagic } from "react-icons/gr";
import { MdEmail } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import Validator from "../utils/validator";

const Login = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const { type } = useParams();
  const navigate = useNavigate();
  const validator = new Validator();

  const handleEmailPin = (e): void => {
    e.preventDefault();
    const isValidEmail = validator.valEmail(email);
    console.log(isValidEmail);
  };

  const handlePhone = (e): void => {
    e.preventDefault();
    const isValidPhone = validator.valPhoneNumber(phone);
    console.log(isValidPhone);
  };

  return (
    <main className="text-[#fff] flex flex-col justify-center items-center h-screen gap-y-5 px-10 lg:px-80">
      {type === "email" ? (
        <>
          <MdEmail className="text-6xl text-secondary" />
          <p className="font-semibold text-[#fff]">Magic Pin</p>
          <p className="text-[#aaa] text-center px-2">
            Use your email to login with a magic{" "}
            <span>
              <GrMagic className="inline" />
            </span>{" "}
            pin
          </p>
          <form className="mt-20 w-full" onSubmit={handleEmailPin}>
            <input
              autoFocus={true}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
              placeholder="Email"
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
          <p className="font-semibold text-[#fff]">
            Login with your phone number
          </p>
          <p className="text-[#aaa] text-center px-2">
            Use your phone number to login to your account securely and easily
          </p>
          <form className="mt-20 w-full" onSubmit={handlePhone}>
            <input
              autoFocus={true}
              onChange={(e) => setPhone(e.target.value)}
              type="phone"
              value={phone}
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
