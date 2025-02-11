import { motion } from "framer-motion";
import React, { FormEvent, useContext, useState } from "react";
import { FaPhone } from "react-icons/fa";
import { GrMagic } from "react-icons/gr";
import { MdEmail } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import NotifCtxt from "../context/notifCtxt.tsx";
import { pinEmail, pinPhone } from "../utils/api.ts";
import { valEmail, valPhoneNumber } from "../utils/validator.ts";

const Login = (): JSX.Element => {
  const { addErrorNotif, addSuccessNotif } = useContext(NotifCtxt);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const { type } = useParams();
  const navigate = useNavigate();

  const handleEmailPin = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    if (!valEmail(email)) {
      addErrorNotif("Invalid Email", "Please provide a valid email", false, []);
      setLoading(false);
      return;
    }

    try {
      localStorage.setItem("email", email);
    } catch (err) {
      console.log(err);
    }

    try {
      const response = await pinEmail(email);
      addSuccessNotif("Email Sent", response.data.data.message, false, []);
      navigate("/verify/email/login");
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      const errorMessage = err.response
        ? err.response.data.message
        : "You are offline, please check your internet connection";
      addErrorNotif("Sending Pin", errorMessage, true, []);
    }
  };

  const handlePhonePin = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const isValidPhone = valPhoneNumber(phone);
    if (!isValidPhone) {
      addErrorNotif(
        "Invalid Phone Number",
        "Please provide a valid number",
        false,
        []
      );
      setLoading(false);
      return;
    }

    try {
      localStorage.setItem("phone", phone);
    } catch (err) {
      console.log(err);
    }

    try {
      const response = await pinPhone(phone);
      addSuccessNotif("Pin Sent", response.data.data.message, false, []);
      navigate("/verify/phone/login");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      const errorMessage = err.response
        ? err.response.data.message
        : "You are offline, please check your internet connection";
      addErrorNotif("Sending Pin", errorMessage, true, []);
    }
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
              disabled={loading}
              whileTap={{ backgroundColor: "#fff" }}
              className="p-3 text-[#000] mt-2 rounded-sm shadow-lg bg-primary w-full"
              type="submit"
            >
              {loading ? <ClipLoader size={17} color="#fff" /> : "Login"}
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
          <form className="mt-20 w-full" onSubmit={handlePhonePin}>
            <input
              autoFocus={true}
              onChange={(e) => setPhone(e.target.value)}
              type="phone"
              value={phone}
              className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
              placeholder="(702)-981-1370"
            />
            <motion.button
              disabled={loading}
              whileTap={{ backgroundColor: "#fff" }}
              className="p-3 text-[#000] mt-2 rounded-sm shadow-lg bg-primary w-full"
              type="submit"
            >
              {loading ? <ClipLoader size={17} color="#fff" /> : "Login"}
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
