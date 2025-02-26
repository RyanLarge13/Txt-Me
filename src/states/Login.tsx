import { motion } from "framer-motion";
import React, {
  FormEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaPhone } from "react-icons/fa";
import { GrMagic } from "react-icons/gr";
import { MdEmail } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { useNotifActions } from "../context/notifCtxt.tsx";
import useLogger from "../hooks/useLogger.ts";
import { pinEmail, pinPhone } from "../utils/api.ts";
import { valEmail, valPhoneNumber } from "../utils/validator.ts";

const ValueInput = React.memo(
  ({
    retrieveValue,
    placeholder,
    type,
  }: {
    retrieveValue: (value: string) => void;
    placeholder: string;
    type: string;
  }): JSX.Element => {
    const [value, setValue] = useState("");

    return (
      <input
        autoFocus={true}
        onChange={(e) => {
          retrieveValue(e.target.value);
          setValue(e.target.value);
        }}
        type={type}
        value={value}
        className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
        placeholder={placeholder}
      />
    );
  }
);

const LoginPhone = (): JSX.Element => {
  const { addErrorNotif, addSuccessNotif, handleAPIErrorNotif } =
    useNotifActions();

  const [loading, setLoading] = useState(false);

  const phone = useRef("");

  const navigate = useNavigate();
  const log = useLogger();

  const validFormData = (): boolean => {
    const isValidPhone = valPhoneNumber(phone.current);
    if (!isValidPhone.valid) {
      addErrorNotif(
        "Invalid Phone Number",
        `Please provide a valid number. ${isValidPhone.reason}`,
        true,
        []
      );
      setLoading(false);
      return false;
    }
    return true;
  };

  const handlePhonePin = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      setLoading(true);

      if (!validFormData()) {
        return;
      }

      try {
        localStorage.setItem("phone", phone.current);
      } catch (err) {
        log.logAllError("Could not store phone number in local storage", err);
      }

      try {
        const response = await pinPhone(phone.current);

        addSuccessNotif(
          "Pin Sent",
          response.data.data?.message ||
            "You can now verify and login via the pin sent to your phone number",
          false,
          []
        );
        navigate("/verify/phone/login");
      } catch (err) {
        log.devLog("Error logging in for phone pin", err);
        handleAPIErrorNotif(err);
        setLoading(false);
      }
    },
    []
  );

  return (
    <>
      <FaPhone className="text-6xl text-secondary" />
      <p className="font-semibold text-[#fff]">Login with your phone number</p>
      <p className="text-[#aaa] text-center px-2">
        Use your phone number to login to your account securely and easily
      </p>
      <form className="mt-20 w-full" onSubmit={handlePhonePin}>
        <ValueInput
          retrieveValue={useCallback((value) => (phone.current = value), [])}
          placeholder="(702)-981-1370"
          type="phone"
        />
        {useMemo(
          () => (
            <motion.button
              disabled={loading}
              whileTap={{ backgroundColor: "#fff" }}
              className="p-3 text-[#000] mt-2 rounded-sm shadow-lg bg-primary w-full"
              type="submit"
            >
              {loading ? <ClipLoader size={17} color="#fff" /> : "Login"}
            </motion.button>
          ),
          [loading]
        )}
      </form>
      {useMemo(
        () => (
          <motion.button
            whileTap={{ backgroundColor: "#fff" }}
            onClick={() => navigate("/login/email")}
            className="p-3 mt-1 rounded-sm shadow-lg text-[#000] bg-tri w-full"
          >
            Login With <MdEmail className="inline ml-1" />
          </motion.button>
        ),
        []
      )}
      <button
        onClick={() => navigate("/signup")}
        className="text-[#fff] text-center px-2"
      >
        New User? Sign Up
      </button>
    </>
  );
};

const LoginEmail = (): JSX.Element => {
  const { addErrorNotif, addSuccessNotif, handleAPIErrorNotif } =
    useNotifActions();

  const [loading, setLoading] = useState(false);
  const email = useRef("");

  const navigate = useNavigate();
  const log = useLogger();

  const validateFormData = (): boolean => {
    const validEmail = valEmail(email.current);

    if (!validEmail.valid) {
      addErrorNotif(
        "Invalid Email",
        `Please provide a valid email. ${validEmail.reason}`,
        false,
        []
      );
      setLoading(false);
      return false;
    }
    return true;
  };

  const handleEmailPin = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      setLoading(true);

      if (!validateFormData()) {
        return;
      }

      try {
        localStorage.setItem("email", email.current);
      } catch (err) {
        log.logAllError("Error storing email in local storage", err);
      }

      try {
        const response = await pinEmail(email.current);
        addSuccessNotif(
          "Email Sent",
          response.data?.message ||
            "You can now login with your one time passcode sent to your email",
          false,
          []
        );
        navigate("/verify/email/login");
      } catch (err) {
        log.logAllError("Error logging into email", err);
        setLoading(false);
        handleAPIErrorNotif(err);
      }
    },
    []
  );

  return (
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
        <ValueInput
          retrieveValue={useCallback((value) => (email.current = value), [])}
          placeholder="Email"
          type="email"
        />
        {useMemo(
          () => (
            <motion.button
              disabled={loading}
              whileTap={{ backgroundColor: "#fff" }}
              className="p-3 text-[#000] mt-2 rounded-sm shadow-lg bg-primary w-full"
              type="submit"
            >
              {loading ? <ClipLoader size={17} color="#fff" /> : "Login"}
            </motion.button>
          ),
          [loading]
        )}
      </form>
      {useMemo(
        () => (
          <motion.button
            whileTap={{ backgroundColor: "#fff" }}
            onClick={() => navigate("/login/phone")}
            className="p-3 mt-1 rounded-sm shadow-lg text-[#000] bg-tri w-full"
          >
            Login With <FaPhone className="inline ml-1" />
          </motion.button>
        ),
        []
      )}
      <button
        onClick={() => navigate("/signup")}
        className="text-[#fff] text-center px-2"
      >
        New User? Sign Up
      </button>
    </>
  );
};

const Login = (): JSX.Element => {
  const { type } = useParams();

  return (
    <main className="text-[#fff] flex flex-col justify-center items-center h-screen gap-y-5 px-10 lg:px-80">
      {type === "email" ? <LoginEmail /> : <LoginPhone />}
    </main>
  );
};

export default Login;
