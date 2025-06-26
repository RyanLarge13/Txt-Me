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

import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoSend } from "react-icons/io5";
import { TiMessages } from "react-icons/ti";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { useDatabase } from "../context/dbContext";
import UserCtxt from "../context/userCtxt";
import useLogger from "../hooks/useLogger";
import useNotifActions from "../hooks/useNotifActions";
import useSocket from "../hooks/useSocket";
import useUserData from "../hooks/useUserData";
import { SocketMessage } from "../types/socketTypes";
import { Message, MessageSessionType } from "../types/userTypes";
import { defaultMessage } from "../utils/constants";
import {
  Crypto_EncryptAESKeyWithReceiversPublicRSAKey,
  Crypto_EncryptMessageWithAES,
  Crypto_GenIV,
  Crypto_GetRawAESKey,
} from "../utils/crypto";
import { tryCatch } from "../utils/helpers";
import { valPhoneNumber } from "../utils/validator";
import MessageComponent from "./MessageComponent";
import MessageInfoTopBar from "./MessageInfoTopBar";

const MessageSession = () => {
  const { messageSession, allMessages, setAllMessages } = useContext(UserCtxt);
  const { IDB_AddMessage } = useDatabase();
  const { addErrorNotif } = useNotifActions();

  const [value, setValue] = useState("");
  const [sessionMessages, setSessionMessages] = useState<Message[]>(
    messageSession?.messages || []
  );

  // Using let variable to possibly update phone number if when
  // sending message phone number is null undefined or an empty string.
  // I would like to get rid of this later and switch back to const instead
  // of let for consistency. I should not have to query for a phone number again
  const [phoneNumber] = useUserData("phoneNumber");

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const location = useLocation();
  const { socket } = useSocket();
  const log = useLogger();

  /*
    NOTE:
      Defining a static line height to feed the auto
      height adjuster for the textarea element
  */
  const lineHeight = 18;

  useEffect(() => {
    if (messageSession) {
      log.devLog(
        "message session exists inside of useEffect being called after a change and update to allMessages map state",
        messageSession
      );

      // Query messages from allMessages map because messageSession is not
      // being updated on every text received or sent only allMessages is being
      // updated
      const newMessageList =
        allMessages.get(messageSession?.number)?.messages || [];

      log.devLog(
        "Here are the messages that are being returned from the map after fetching messages by messagesSession.number",
        newMessageList
      );

      setSessionMessages(newMessageList);
    }
  }, [allMessages, messageSession]);

  /*
    DESC:
      useEffect to scroll the message rendering parent
      to the bottom for the latest messages
  */
  useEffect(() => {
    if (messagesRef.current) {
      const elem = messagesRef.current;

      const rect = elem.getBoundingClientRect();
      const height = rect.height;
      elem.scrollTo(0, height);
    }
  }, [messagesRef, sessionMessages, allMessages]);

  /*
    DESC:
      useEffect to control the dynamical height changes of the textarea as
      the user types
  */
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(
        textarea.scrollHeight - 14,
        lineHeight * 5
      )}px`;
    }
  }, [value]);

  /*
      TODO:
        CONSIDER:
          1. Another method found in another part of code (socketCtxt) almost identical. 
          Consider consolidating
       */
  const M_AddMessageToIndexedDB = async (newMessage: Message) => {
    try {
      await IDB_AddMessage(newMessage);
    } catch (err) {
      log.logAllError(
        "Error adding message to indexedDB sending from client",
        err
      );
    }
  };

  const M_SendMessage = async (
    e: FormEvent<HTMLFormElement>,
    messageSession: MessageSessionType
  ) => {
    e.preventDefault();
    /*
    TODO:
      IMPLEMENT:
        X - 1. If phoneNumber fails to be present check indexDB for the phone number instead of 
        showing cannot send message error. Could potentially remove all of this if I find the 
        issue of why phoneNumber is and empty string
        
        2. If no bugs are found and phoneNumber can potentially be null "" or undefined 
        then possibly add an option in the notification to query for the phone number in a user 
        friendly prompt inside the NotifActions array
      DEBUG:  
        1. Make sure fromnumber aka: your own number associated with the current users 
        account exists and is valid before trying to send a message. phoneNumber seems to not 
        exists in some kind of situation. Possibly because the login is not updating the user 
        object correctly?
      DONE:
        1. So far phoneNumber is checked twice, but the first time it is checked the phone number 
        is re-queried from IndexDB before throwing an error to the user 
        @see updatePhoneNumber && IMPLEMENT 1.
      
    */

    log.devLog("Checking if phone number exists", phoneNumber);

    const validPhone = valPhoneNumber(phoneNumber);

    const { data: iv, error: ivGenError } = await tryCatch<BufferSource>(
      Crypto_GenIV
    );

    if (ivGenError || !iv) {
      throw new Error(`Check Gen IV method in crypto.js. ${ivGenError}`);
    }

    /*
      CONSIDER: 
        Possibly remove non-null assertion and replace with an update function that
        provides a fresh AES Key for the message session. This problem should not arise 
        at this point in the program, but now that I have said that out loud we know 
        somehow there is a way for the bug to come to life
      NOTE:
        NON-NULL ASSERTION FOR AES KEY
    */
    const { data: rawAESKey, error: rawAESKeyError } =
      await tryCatch<BufferSource>(() =>
        Crypto_GetRawAESKey(messageSession.AESKey!)
      );

    if (rawAESKeyError || !rawAESKey) {
      throw new Error(
        `Check Gen RawAESKey method in crypto.js. ${rawAESKeyError}`
      );
    }

    /*
      IMPLEMENT: 
        Should query for key if it does not exist and remove 
        non-null assertion. Potential for the key to be unavailable is too high.
      NOTE:
        NON-NULL ASSERTION FOR RSA KEY PAIR
    */
    const { data: encryptedAESKey, error: AESKeyEncryptionError } =
      await tryCatch<ArrayBuffer>(() =>
        Crypto_EncryptAESKeyWithReceiversPublicRSAKey(
          messageSession.receiversRSAPublicKey!,
          rawAESKey
        )
      );

    if (AESKeyEncryptionError || !encryptedAESKey) {
      throw new Error(
        `Check Gen RawAESKey method in crypto.js. ${rawAESKeyError}`
      );
    }

    /*
      CONSIDER: 
        Possibly remove non-null assertion and replace with an update function that
        provides a fresh AES Key for the message session. This problem should not arise 
        at this point in the program, but now that I have said that out loud we know 
        somehow there is a way for the bug to come to life
      NOTE:
        NON-NULL ASSERTION FOR AES KEY
    */
    const { data: encryptedMessage, error: encryptMessageError } =
      await tryCatch<ArrayBuffer>(() =>
        Crypto_EncryptMessageWithAES(iv, messageSession.AESKey!, value)
      );

    if (encryptMessageError || !encryptedMessage) {
      throw new Error(
        `Error encrypting message before sending to server. Check Crypto_. Error: ${encryptMessageError}`
      );
    }

    if (!validPhone.valid) {
      /*
      TODO:
        IMPLEMENT:
          1. Prompt the user to update their phone number??
       */
      addErrorNotif("Failed To Send", validPhone.reason, true, [
        { text: "refresh", func: (): void => window.location.reload() },
      ]);
      return;
    }

    const newMessage: Message = {
      ...defaultMessage,
      messageid: uuidv4(),
      toname: messageSession.contact?.name || messageSession.number,
      message: value,
      fromnumber: phoneNumber,
      tonumber: messageSession.number,
      sentat: new Date(),
      synced: false,
    };

    const socketMessage: SocketMessage = {
      ...newMessage,
      message: encryptedMessage,
      iv: iv,
      encryptedAESKey: encryptedAESKey,
    };

    socket ? socket.emit("text-message", socketMessage) : null;

    // Check first to see if the allMessages map has the key?? For safety
    if (!allMessages.has(messageSession.number)) {
      allMessages.set(messageSession.number, {
        contact: messageSession.contact,
        messages: [newMessage],
        AESKey: messageSession.AESKey,
      });
    } else {
      allMessages.get(messageSession.number)?.messages.push(newMessage);
    }

    const newMap = new Map(allMessages);

    setAllMessages(newMap);
    setValue("");
    M_AddMessageToIndexedDB(newMessage);
  };

  return messageSession !== null ? (
    <div
      ref={messagesRef}
      className={`h-full w-full overflow-y-auto pb-20 duration-200 ${
        location.pathname === "/profile" ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Name and number at top of message session view */}
      <MessageInfoTopBar messageSession={messageSession} />
      {/* Name and number at top of message session view */}
      {sessionMessages.length > 0 ? (
        <div className="flex flex-col justify-start px-10 py-20 gap-y-16 min-h-full">
          {sessionMessages.map((message: Message, index) => (
            <MessageComponent
              key={index}
              message={message}
              length={sessionMessages.length}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <p className="text-gray-400 text-center mb-10">No Messages</p>
          <p className="text-primary text-9xl">
            <TiMessages />
          </p>
        </div>
      )}
      <form
        onSubmit={(e) => M_SendMessage(e, messageSession)}
        className="bg-black fixed bottom-[60px] left-0 right-0 py-5 px-2 flex justify-between items-center gap-x-2"
      >
        <textarea
          ref={textareaRef}
          name="message"
          id="message"
          cols={50}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="text message"
          className="px-3 py-2 w-full h-[38px] bg-[#222] rounded-md duration-200 whitespace-pre-wrap break-words outline-none resize-none"
          style={{
            overflow: "hidden",
            lineHeight: `${lineHeight}px`,
            maxHeight: `${lineHeight * 5}px`,
            minHeight: `${lineHeight}px`,
          }}
        ></textarea>
        <button
          type="submit"
          className="text-primary flex justify-center items-center p-3"
        >
          <IoSend />
        </button>
      </form>
    </div>
  ) : (
    <p className="text-primary text-9xl">
      <TiMessages />
    </p>
  );
};

export default MessageSession;
