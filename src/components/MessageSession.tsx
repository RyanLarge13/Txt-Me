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

import React, { useContext, useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";

import UserCtxt from "../context/userCtxt";
import useSocket from "../hooks/useSocket";
import useUserData from "../hooks/useUserData";

const MessageSession = () => {
  const { messageSession, setMessageSession } = useContext(UserCtxt);
  const { socket, message } = useSocket();

  const [value, setValue] = useState("");
  const [phoneNumber] = useUserData("phoneNumber");

  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const newMessage = message;
    if (newMessage) {
      console.log("New message from me or sender");
      // setMessageSession((prev) => {
      //   if (!prev) {
      //     return null;
      //   }
      //   return {
      //     ...prev,
      //     messages: [
      //       ...prev.messages,
      //       {
      //         fromid: newMessage.fromid,
      //         message: newMessage.message,
      //         time: newMessage.time,
      //       },
      //     ],
      //   };
      // });
      setTimeout(() => {
        if (messagesRef && messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [message, setMessageSession]);

  const sendMessage = () => {
    // setMessageSession((prev) => {
    //   if (!prev) {
    //     return null;
    //   }
    //   return {
    //     ...prev,
    //     messages: [
    //       ...prev.messages,
    //       {
    //         fromid: phoneNumber,
    //         message: value,
    //         time: new Date(),
    //       },
    //     ],
    //   };
    // });
    setTimeout(() => {
      if (messagesRef && messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    }, 0);
    if (socket && messageSession) {
      socket.emit("text-message", {
        sender: phoneNumber,
        recipient: messageSession.contact.number,
        message: value,
        time: new Date(),
      });
      setValue("");
    }
  };

  return (
    <div
      ref={messagesRef}
      className="h-full w-full overflow-y-auto py-20 scroll-smooth"
    >
      <div className="p-5 fixed top-0 z-10 right-0 left-0 bg-black">
        <p>{messageSession?.contact.name}</p>
        <p>{messageSession?.contact.number}</p>
      </div>
      {messageSession && messageSession.messages.length > 0 ? (
        <div className="flex flex-col justify-start px-10 py-20 gap-y-5 min-h-full">
          {messageSession.messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.fromid === phoneNumber
                  ? "bg-tri self-end"
                  : "bg-secondary self-start"
              } rounded-lg shadow-lg text-black p-3 outline-red-400 min-w-[50%]`}
            >
              <p>{message.message}</p>
              <p>
                {message.time
                  ? message.time.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      dayPeriod: "short",
                    })
                  : "Just Now"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-40">No Messages</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="bg-black fixed bottom-[60px] left-0 right-0 py-5 px-2 flex justify-between items-center gap-x-2"
      >
        <textarea
          name="message"
          id="message"
          rows={1}
          cols={50}
          value={value}
          onKeyDown={(e) => {
            const key = e.key;
            if (key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          onChange={(e) => setValue(e.target.value)}
          placeholder="text message"
          className="px-3 py-2 h-auto w-full bg-[#222] rounded-full whitespace-pre-wrap break-words outline-none focus:outline-none"
        ></textarea>
        <button
          type="submit"
          onClick={sendMessage}
          className="text-primary flex justify-center items-center p-3"
        >
          <IoSend />
        </button>
      </form>
    </div>
  );
};

export default MessageSession;
