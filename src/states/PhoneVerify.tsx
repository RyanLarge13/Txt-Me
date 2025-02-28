import { motion } from "framer-motion";
import React, { FormEvent, useState } from "react";
import { MdOutlinePermPhoneMsg } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { useConfig } from "../context/configContext.tsx";
import { useDatabase } from "../context/dbContext.tsx";
import useLogger from "../hooks/useLogger.ts";
import useNotifActions from "../hooks/useNotifActions.ts";
import { verifyPhone, verifyPhoneLogin } from "../utils/api";
import { defaultUser } from "../utils/constants.js";
import { valInt, valPhoneNumber } from "../utils/validator.ts";

const PhoneVerify = (): JSX.Element => {
  const { updateUserInDB } = useDatabase();
  const { getUserData, setUser } = useConfig();
  const { addErrorNotif, handleAPIErrorNotif, addSuccessNotif } =
    useNotifActions();

  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const log = useLogger();
  const token = getUserData("authToken");
  const { method } = useParams();

  const verifyPhoneNumber = (): string => {
    const printError = () => {
      addErrorNotif(
        "Invalid Phone Number",
        "Please try requesting a new pin again. It seems you either are missing a phone number, or input an invalid phone number",
        true,
        []
      );
    };

    try {
      const phone = localStorage.getItem("phone") || "";
      if (!valPhoneNumber(phone).valid) {
        printError();
        return "";
      } else {
        return phone;
      }
    } catch (err) {
      log.logAllError(
        "User could not pull phone from localStorage when verifying login with phone. Either the value did not exist or JavaScript is off",
        err
      );
      printError();
      return "";
    } finally {
      setLoading(false);
      navigate("/login/phone");
    }
  };

  const verifyPin = (): boolean => {
    const pinNumber = Number(pin);
    if (!pinNumber || isNaN(pinNumber)) {
      addErrorNotif(
        "6 Digit Pin",
        "No characters or special characters are allowed in this pin. It must only contain digits 0-9. Please try again",
        true,
        []
      );
      return false;
    }

    const pinIsVerified = valInt({
      number: pinNumber,
      minSize: 6,
      maxSize: 6,
      testLen: true,
      inputName: "pin",
    });

    if (!pinIsVerified.valid) {
      addErrorNotif(
        "6 Digit Pin",
        `${pinIsVerified.reason}. Please try to input the correct pin`,
        true,
        []
      );
      return false;
    }
    return true;
  };

  const handlePhoneLogin = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    const phone = verifyPhoneNumber();
    const verifiedPin = verifyPin();

    if (!phone || !verifiedPin) {
      return;
    }

    try {
      const response = await verifyPhoneLogin(phone, pin);
      log.devLog("Response from phone login", response);

      const serverToken = response.data?.token || "";
      const serverUser = response.data?.newUser || defaultUser;

      if (!serverToken || serverUser.userId === 0) {
        log.logAllError(
          "Server did not return a token or user when logging in via phone. Check server immediately!"
        );
      }

      setUser({ ...serverUser, authToken: serverToken });

      try {
        await updateUserInDB({ ...serverUser, authToken: serverToken });
      } catch (err) {
        log.logAllError(
          "Error storing new token in Local DB after login phone was called",
          err
        );
      }

      addSuccessNotif(
        "Logged In",
        `Welcome ${serverUser?.username || ""}`,
        false,
        []
      );
      navigate("/profile");
    } catch (err) {
      setLoading(false);
      handleAPIErrorNotif(err);
      log.logAllError("Error when log in with pin via phone was called", err);
    }
  };

  const handlePhoneVerify = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      addErrorNotif(
        "Login Or Sign Up",
        "Please sign up or login first before attempting to verify a phone number",
        true,
        []
      );
      navigate("/login/phone");
    }

    const verifiedPin = verifyPin();

    if (!verifiedPin) {
      return;
    }

    try {
      const response = await verifyPhone(token, pin);
      log.devLog("Response from verify phone", response);
      addSuccessNotif(
        "Verify Phone",
        "A pin was sent to the phone number you specified",
        false,
        []
      );
      navigate("/verify/phone/verify");
    } catch (err) {
      setLoading(false);
      log.logAllError("Error calling verify phone", err);
      handleAPIErrorNotif(err);
    }
  };

  return (
    <div>
      <MdOutlinePermPhoneMsg className="text-6xl text-secondary" />
      <p className="font-semibold text-[#fff]">One Time Pass Code</p>
      <p className="text-[#aaa] text-center px-2">
        Verify your phone number with the pin sent to your phone via sms
      </p>
      <form
        className="mt-20 w-full"
        onSubmit={(e) => {
          if (method === "verify") {
            handlePhoneVerify(e);
          }
          if (method === "login") {
            handlePhoneLogin(e);
          }
        }}
      >
        <input
          autoFocus={true}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
          placeholder="6 digit pin"
        />
        <motion.button
          disabled={loading}
          whileTap={{ backgroundColor: "#fff" }}
          className="p-3 text-[#000] mt-2 rounded-sm shadow-lg bg-primary w-full"
          type="submit"
        >
          {loading ? <ClipLoader size={17} color="#fff" /> : "Verify"}
        </motion.button>
      </form>
    </div>
  );
};

export default PhoneVerify;
