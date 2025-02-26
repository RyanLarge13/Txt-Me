import { motion } from "framer-motion";
import React, { FormEvent, useState } from "react";
import { TiMessages } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { useConfig } from "../context/configContext.tsx";
import { useNotifActions } from "../context/notifCtxt.tsx";
import useLogger from "../hooks/useLogger.ts";
import { signUp } from "../utils/api.ts";
import {
  valEmail,
  valPassword,
  valPhoneNumber,
  valUsername,
} from "../utils/validator.ts";

const SignUp = React.memo((): JSX.Element => {
  const { handleAPIErrorNotif, addErrorNotif } = useNotifActions();
  const { setUser } = useConfig();

  const [loading, setLoading] = useState(false);

  const log = useLogger();
  const navigate = useNavigate();

  const validateForm = (
    username: string,
    email: string,
    phone: string,
    password: string
  ): boolean => {
    const valArr = [
      valUsername(username),
      valEmail(email),
      valPhoneNumber(phone),
      valPassword(password),
    ];
    const showError = valArr.some((validation) => validation.valid === false);

    if (showError) {
      valArr.forEach((validation) => {
        if (!validation.valid) {
          addErrorNotif("Bad Field", validation.reason, true, []);
        }
      });
      return false;
    }
    return true;
  };

  const signUpNewUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    if (!validateForm(username, email, phone, password)) {
      setLoading(false);
      return;
    }

    try {
      const newUser = { username, email, phone, password };
      const response = await signUp(newUser);

      const newToken = response.data?.token || "";

      if (!newToken) {
        log.logAllError(
          "No auth token from the server. Check server immediately"
        );
        addErrorNotif(
          "Sign Up Failed",
          "There was an unexpected problem with our servers. If the issue persists please contact the developer immediately at your earliest convenience",
          true,
          []
        );
        throw new Error(
          "There was no token returned from the server. Check server immediately! You should not be getting this error"
        );
      }

      setUser((prev) => {
        return { ...prev, authToken: newToken };
      });

      try {
        localStorage.setItem("authToken", newToken);
      } catch (err) {
        log.logAllError("Error saving authToken to localStorage. Error: ", err);
      }

      navigate("/verify/phone/verify");
    } catch (err) {
      handleAPIErrorNotif(err);
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
          type="username"
          name="username"
          id="username"
          className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
          placeholder="Username"
        />
        <input
          type="email"
          name="email"
          id="email"
          className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
          placeholder="Email"
        />
        <input
          type="tel"
          name="phone"
          id="phone"
          className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
          placeholder="(702)-981-1370"
        />
        <input
          type="password"
          name="password"
          id="password"
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
