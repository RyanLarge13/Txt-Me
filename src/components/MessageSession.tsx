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

import { useDatabase } from "../context/dbContext";
import UserCtxt from "../context/userCtxt";
import useLogger from "../hooks/useLogger";
import useNotifActions from "../hooks/useNotifActions";
import useSocket from "../hooks/useSocket";
import useUserData from "../hooks/useUserData";
import { Message, MessageSessionType } from "../types/userTypes";
import { defaultMessage } from "../utils/constants";
import { valPhoneNumber } from "../utils/validator";

const MessageSession = () => {
  const { messageSession, allMessages, setAllMessages } = useContext(UserCtxt);
  const { IDB_AddMessage } = useDatabase();
  const { addErrorNotif } = useNotifActions();

  const [value, setValue] = useState("");
  const [sessionMessages, setSessionMessages] = useState<Message[]>(
    messageSession?.messages || []
  );

  // Using let variable to possibly update phone number if when sending message phone number is null undefined or an empty string. I would like to get rid of this later and switch back to const instead of let for consistency. I should not have to query for a phone number again
  const [phoneNumber] = useUserData("phoneNumber");

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const { socket } = useSocket();
  const log = useLogger();

  useEffect(() => {
    if (messageSession) {
      log.devLog(
        "message session exists inside of useEffect being called after a change and update to allMessages map state"
      );

      // Query messages from allMessages map because messageSession is not being updated on every text received or sent only allMessages is being updated
      const newMessageList =
        allMessages.get(messageSession?.number)?.messages || [];

      log.devLog(
        "Here are the messages that are being returned from the map after fetching messages by messagesSession.number",
        newMessageList
      );

      setSessionMessages(newMessageList);
    }
  }, [allMessages, messageSession]);

  // @Consider ----------------------
  // Another method found in another part of code (socketCtxt) almost identical. Consider consolidating
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

  const M_SendMessage = (
    e: FormEvent<HTMLFormElement>,
    messageSession: MessageSessionType
  ) => {
    e.preventDefault();

    if (phoneNumber === "") {
      log.devLog(
        "Phone number is an empty string when attempting to send a new message. Setting phoneNumber"
      );
    }
    /*
    TODO:
      IMPLEMENT:
        X - 1. If phoneNumber fails to be present check indexDB for the phone number instead of showing cannot send message error. Could potentially remove all of this if I find the issue of why phoneNumber is and empty string
        
        2. If no bugs are found and phoneNumber can potentially be null "" or undefined then possibly add an option in the notification to query for the phone number in a user friendly prompt inside the NotifActions array
      DEBUG:  
        1. Make sure fromnumber aka: your own number associated with the current users account exists and is valid before trying to send a message. phoneNumber seems to not exists in some kind of situation. Possibly because the login is not updating the user object correctly?
      DONE:
        1. So far phoneNumber is checked twice, but the first time it is checked the phone number is re-queried from IndexDB before throwing an error to the user @see updatePhoneNumber && IMPLEMENT 1.
      
    */

    log.devLog("Checking if phone number exists", phoneNumber);

    // If the current users phoneNumber cannot be found for some reason, prompt them to refresh the screen.
    if (!phoneNumber) {
      addErrorNotif(
        "Failed To Send",
        "We could not send your message. Please refresh and try again",
        true,
        [{ text: "refresh", func: (): void => window.location.reload() }]
      );
      return;
    }

    const validPhone = valPhoneNumber(phoneNumber);

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

    const newMessage = {
      ...defaultMessage,
      message: value,
      fromnumber: phoneNumber,
      tonumber: messageSession.number,
      sentat: new Date(),
    };
    socket ? socket.emit("text-message", newMessage) : null;

    // Check first to see if the allMessages map has the key?? For safety
    if (!allMessages.has(messageSession.number)) {
      allMessages.set(messageSession.number, {
        contact: messageSession.contact,
        messages: [newMessage],
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
      className="h-full w-full overflow-y-auto py-20 scroll-smooth"
    >
      <div className="p-2 fixed top-0 z-10 right-0 left-0 bg-black">
        <p className="mb-1">
          {messageSession.contact?.name || messageSession.number}
        </p>
        <p>{messageSession.contact?.number || ""}</p>
      </div>
      {sessionMessages.length > 0 ? (
        <div className="flex flex-col justify-start px-10 py-20 gap-y-5 min-h-full">
          {sessionMessages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.fromnumber === phoneNumber
                  ? "bg-tri self-end"
                  : "bg-secondary self-start"
              } rounded-lg shadow-lg text-black p-3 outline-red-400 min-w-[50%]`}
            >
              <p>{message.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-40">No Messages</p>
      )}
      <form
        onSubmit={(e) => M_SendMessage(e, messageSession)}
        className="bg-black fixed bottom-[60px] left-0 right-0 py-5 px-2 flex justify-between items-center gap-x-2"
      >
        <textarea
          name="message"
          id="message"
          rows={1}
          cols={50}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="text message"
          className="px-3 py-2 h-auto w-full bg-[#222] rounded-full whitespace-pre-wrap break-words outline-none focus:outline-none"
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
