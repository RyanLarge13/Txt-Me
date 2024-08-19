import { useState, useContext, FormEvent } from "react";
import { motion } from "framer-motion";
import { FaPhone } from "react-icons/fa";
import { GrMagic } from "react-icons/gr";
import { MdEmail } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import { pinEmail, pinPhone } from "../utils/api.ts";
import UserCtxt from "../context/userCtxt.tsx";
import { ClipLoader } from "react-spinners";
import Validator from "../utils/validator";

const Login = (): JSX.Element => {
  const { notifHdlr } = useContext(UserCtxt);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const { type } = useParams();
  const navigate = useNavigate();
  const validator = new Validator();

  const handleEmailPin = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setLoading(true);
    const isValidEmail = validator.valEmail(email);
    if (!isValidEmail) {
      notifHdlr.setNotif(
        "Invalid",
        "Please insert a valid email address",
        true,
        []
      );
      setLoading(false);
      return;
    }
    try {
      localStorage.setItem("email", email);
      pinEmail(email)
        .then((res) => {
          notifHdlr.setNotif("Sent", res.data.message, true, []);
          navigate("/verify/email/login");
        })
        .catch((err) => {
          console.log(err);
          const errorMessage = err.response
            ? err.response.data.message
            : "You are offline, please check your internet connection";
          notifHdlr.setNotif("Error", errorMessage, true, []);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      if (err instanceof Error) {
        notifHdlr.setNotif("Error", err.message, true, []);
      }
      console.log(err);
    }
  };

  const handlePhonePin = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setLoading(true);
    const isValidPhone = validator.valPhoneNumber(phone);
    if (!isValidPhone) {
      notifHdlr.setNotif(
        "Invalid",
        "Please insert a valid phone number",
        true,
        []
      );
      setLoading(false);
      return;
    }
    try {
      pinPhone(phone)
        .then((res) => {
          console.log(res);
          localStorage.setItem("phone", phone);
          notifHdlr.setNotif("Error", res.data.message, true, []);
          navigate("/verify/phone/login");
        })
        .catch((err) => {
          console.log(err);
          const errorMessage = err.response
            ? err.response.data.message
            : "You are offline, please check your internet connection";
          notifHdlr.setNotif("Error", errorMessage, true, []);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      if (err instanceof Error) {
        notifHdlr.setNotif("Error", err.message, true, []);
      }
      console.log(err);
      setLoading(false);
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
