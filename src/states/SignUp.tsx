import { motion } from "framer-motion";
import React, { FormEvent, useState } from "react";
import { TiMessages } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { useConfig } from "../context/configContext.tsx";
import { useNotifActions } from "../context/notifCtxt.tsx";
import UserCtxt from "../context/userCtxt.tsx";
import { signUp } from "../utils/api.ts";
import {
  valEmail,
  valPassword,
  valPhoneNumber,
  valUsername,
} from "../utils/validator.ts";

const SignUp = React.memo((): JSX.Element => {
  const { addErrorNotif } = useNotifActions();
  const { setUser } = useConfig();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const signUpNewUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setLoading(true);
    const valArr = [
      valUsername(username),
      valEmail(email),
      valPhoneNumber(phone),
      valPassword(password),
    ];
    const showError = valArr.some((validation) => validation === false);
    if (showError) {
      let type = "";
      const firstIndex = valArr.indexOf(false);
      switch (firstIndex) {
        case 0:
          type = "username";
          break;
        case 1:
          type = "email";
          break;
        case 2:
          type = "phone";
          break;
        case 3:
          type = "Password";
          break;
        default:
          "username";
          break;
      }
      addErrorNotif(
        "Invalid Field",
        `Please correct any discrepancies you can find before attempting to sign in again`,
        false,
        []
      );
      // setLoading(false);
      return;
    }
    try {
      const response = await signUp({ username, email, phone, password });

      setUser((prev) => {
        return { ...prev, authToken: response.data.data.token };
      });

      try {
        localStorage.setItem("authToken", response.data.data.token);
      } catch (err) {
        console.log(`Error saving authToken to localStorage. Error: ${err}`);
      }

      navigate("/verify/phone/verify");
    } catch (err) {
      console.log(err);
      // setLoading(false);
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
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
          placeholder="Username"
        />
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
          placeholder="Email"
        />
        <input
          type="phone"
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
          className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
          placeholder="(702)-981-1370"
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
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
});

export default SignUp;
