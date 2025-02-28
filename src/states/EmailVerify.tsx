import { motion } from "framer-motion";
import React, { FormEvent, useState } from "react";
import { MdMarkEmailRead } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { useConfig } from "../context/configContext.tsx";
import { useDatabase } from "../context/dbContext.tsx";
import { useNotifActions } from "../context/notifCtxt.tsx";
import useLogger from "../hooks/useLogger.ts";
import { verifyEmail, verifyEmailLogin } from "../utils/api";
import { defaultUser } from "../utils/constants.js";
import { valEmail, valInt } from "../utils/validator.ts";

const EmailVerify = (): JSX.Element => {
	const { getUserData, setUser } = useConfig();
	const { addErrorNotif, addSuccessNotif, handleAPIErrorNotif } =
		useNotifActions();
	const { updateUserInDB } = useDatabase();

	const [emailPin, setEmailPin] = useState("");
	const [loading, setLoading] = useState(false);
	const [token] = useUserData("authToken");

	const navigate = useNavigate();
	const log = useLogger();
//	const token = getUserData("authToken");
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
		const pinNumber = Number(emailPin);
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
			inputName: "pin"
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

		// if (!token) {
		//       addErrorNotif(
		//         "Login",
		//         "Please try to login again or sign up if you have not already before trying to verify your email",
		//         true,
		//         []
		//       );
		//       log.devLogDebug("No token present when calling handleEmailVerify");
		//       navigate("/login/email");
		//     }

		if (!verifyPin()) {
			setLoading(false);
			return;
		}

		try {
			const response = await verifyEmail(token, emailPin);
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

	const handleEmailLogin = async (
		e: FormEvent<HTMLFormElement>
	): Promise<void> => {
		setLoading(true);
		e.preventDefault();

		const email = isEmailValid();

		if (email === "" || !verifyPin()) {
			setLoading(false);
			return;
		}

		try {
			const response = await verifyEmailLogin(email, emailPin);

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

			setUser(prev => ({ ...prev, authToken: serverUser.authToken }));

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
				onSubmit={e => {
					if (method === "verify") {
						handleEmailVerify(e);
					}
					if (method === "login") {
						handleEmailLogin(e);
					}
				}}
			>
				<input
					autoFocus={true}
					className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
					placeholder="pin"
					value={emailPin}
					onChange={e => setEmailPin(e.target.value)}
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
