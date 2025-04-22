/*
Txt Me - A web based messaging platform
Copyright (C) 2025 Ryan Large

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import { motion } from "framer-motion";
import React, { FormEvent, useCallback, useRef, useState } from "react";
import { MdMarkEmailRead } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import ValueInput from "../components/ValueInput.tsx";
import { useConfig } from "../context/configContext.tsx";
import { useDatabase } from "../context/dbContext.tsx";
import useLogger from "../hooks/useLogger.ts";
import useNotifActions from "../hooks/useNotifActions.ts";
import useUserData from "../hooks/useUserData.ts";
import { API_VerifyEmail, API_VerifyEmailLogin } from "../utils/api";
import { defaultUser } from "../utils/constants.js";
import { valEmail, valInt } from "../utils/validator.ts";

const EmailVerify = (): JSX.Element => {
  const { setUser } = useConfig();
  const { addErrorNotif, addSuccessNotif, handleAPIErrorNotif } =
    useNotifActions();
  const { updateUserInDB } = useDatabase();

  // const [emailPin, setEmailPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [token] = useUserData("authToken");

  const emailPin = useRef("");
  const navigate = useNavigate();
  const log = useLogger();
  const { method } = useParams();

  const isEmailValid = (): string => {
    try {
      const email = localStorage.getItem("email") || "";
      if (!email) {
        log.logAllError(
          "Error grabbing email from local storage. Either does not exist or Javascript is turned off"
        );
        return "";
      }

      const validEmail = valEmail(email);

      if (!validEmail.valid) {
        addErrorNotif("Invalid Email", validEmail.reason, true, []);
        return "";
      }
      return email;
    } catch (err) {
      log.logAllError(
        "Error when trying to parse localStorage for users email",
        err
      );
      return "";
    }
  };

  const verifyPin = (): boolean => {
    /*
    TODO: 
      DEBUG: 
        1. Find out if Number(pin) where pin starts with a 0 is causing an error here when doing length checks
    */
    const pinNumber = Number(emailPin.current);
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

  const handleEmailVerify = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      addErrorNotif(
        "Login",
        "Please try to login again or sign up if you have not already before trying to verify your email",
        true,
        []
      );
      log.devLogDebug("No token present when calling handleEmailVerify");
      navigate("/login/email");
    }

    if (!verifyPin()) {
      setLoading(false);
      return;
    }

    try {
      const response = await API_VerifyEmail(token, emailPin.current);
      log.devLog(
        "Response from verifyEmail API call to server under handleEmailVerify",
        response
      );

      const message = response.data?.message;

      if (!message) {
        log.logAllError(
          "Error. Server did not respond with message expected. Check server immediately!"
        );
      }

      addSuccessNotif(
        "Login",
        "Your email is now verified! You can now login with this email",
        false,
        []
      );
      navigate("/login/email");
    } catch (err) {
      log.logAllError(
        "Error when calling verifyEmail API call to server in HandleEmailVerify function",
        err
      );
      handleAPIErrorNotif(err);
      setLoading(false);
    }
  };

  // This function takes the pin sent to the users email and verifies that that pin is correct
  // and logs in the user sending back the auth and user details from the server
  const handleEmailLogin = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    /*
     TODO:
      IMPLEMENT: 
        1. Confirm the storage of server user is correct and consistent.

        2. Make sure ram is being updated correctly with the user information. User phone number comes back 
        as an empty string after first login.
     */

    setLoading(true);
    e.preventDefault();

    const email = isEmailValid();

    if (email === "" || !verifyPin()) {
      setLoading(false);
      return;
    }

    try {
      const response = await API_VerifyEmailLogin(email, emailPin.current);

      try {
        localStorage.removeItem("email");
      } catch (err) {
        log.logAllError(
          "Could not remove email from localStorage after calling verifyEmailLogin in handleEmailLog",
          err
        );
      }

      const serverToken = response.data.data?.token || "";
      const serverUser = response.data.data?.newUser || defaultUser;

      if (!serverToken || serverUser.userId === 0) {
        log.logAllError(
          "Server did not return new user object or did not return token string after calling verifyEmailLogin in handleEmailLogin. Check server immediately!"
        );
      }

      setUser((prev) => ({ ...prev, authToken: serverToken }));

      try {
        await updateUserInDB({ ...serverUser, authToken: serverToken });
      } catch (err) {
        log.logAllError(
          "Error storing new token in Local DB after login email was called",
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
      log.logAllError(
        "Error when calling verifyEmailLogin API request call inside handleEmailLogin",
        err
      );
      handleAPIErrorNotif(err);
    }
  };

  return (
    <>
      <MdMarkEmailRead className="text-6xl text-secondary" />
      <p className="font-semibold text-[#fff]">One Time Pass Code</p>
      <p className="text-[#aaa] text-center px-2">
        Verify your account by inserting the pin sent to your email address
      </p>
      <form
        className="mt-20 w-full"
        onSubmit={(e) => {
          if (method === "verify") {
            handleEmailVerify(e);
          }
          if (method === "login") {
            handleEmailLogin(e);
          }
        }}
      >
        <ValueInput
          retrieveValue={useCallback((value) => (emailPin.current = value), [])}
          placeholder="pin"
          type="text"
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
    </>
  );
};

export default EmailVerify;
