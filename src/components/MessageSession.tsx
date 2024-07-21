import React, { useContext, useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import UserCtxt from "../context/userCtxt";
import { useSocket } from "../context/socketCtxt";

const MessageSession = () => {
  const { user, messageSession, setMessageSession } = useContext(UserCtxt);
  const socket = useSocket();
  /*
  TODO:
  1. We need a better way of setting message state in messageSession. the map with probably do us just fine.
  Need to include message session state as well as message new Map();
  */

  const [value, setValue] = useState("");

  const sendMessage = () => {
    // change this below!!!!
    setMessageSession((prev) => {
      return {
        ...prev,
        messages: [...prev.messages, { fromid: user?.userId, message: value }],
      };
    });
    console.log(socket);
    socket.emit("text-message", value);
    setValue("");
  };

  useEffect(() => {
    console.log(messageSession);
  }, [messageSession]);

  return (
    <div className="h-full w-full overflow-y-auto py-20">
      <div className="p-5 fixed top-20 right-0 left-0">
        <p>{messageSession.contact.name}</p>
        {/* <p>{messageSession.contact.number}</p> */}
        {/* <p>702-981-1370</p> */}
      </div>
      {messageSession.messages.length > 0 ? (
        <div className="flex flex-col justify-start px-10 py-20 gap-y-5 min-h-full">
          {messageSession.messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.fromid === user?.userId
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
        onSubmit={(e) => {
          e.preventDefault();
          // sendMessage();
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
