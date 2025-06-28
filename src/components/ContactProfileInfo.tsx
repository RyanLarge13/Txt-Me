import React, { useContext } from "react";
import { FaMessage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import { useDatabase } from "../context/dbContext";
import UserCtxt from "../context/userCtxt";
import useLogger from "../hooks/useLogger";
import { ContactType } from "../types/contactTypes";
import { MessageSessionType } from "../types/messageTypes";

const ContactProfileInfo = ({ contact }: { contact: ContactType }) => {
  const { messageSessionsMap, setMessageSession } = useContext(UserCtxt);
  const { IDB_UpdateMessageSession } = useDatabase();

  const log = useLogger();
  const navigate = useNavigate();

  const session = messageSessionsMap.get(contact.number);
  const contactMessages = session?.messages || [];
  const sessionAESKey = session?.AESKey;

  const lastMessage =
    contactMessages.length > 0
      ? contactMessages[contactMessages.length - 1]
      : null;

  /*
  CONSIDER:
    1. Open message session function below could be reused
    this same function is used inside of ChatsMenu component
*/
  const M_CreateMessageSession = () => {
    log.devLog(
      "Creating a new message session from ContactProfileInfo.tsx. Logging messages and contact that is involved for creating session from click",
      "contact: ",
      contact,
      "Messages: ",
      contactMessages
    );

    if (!contact) {
      log.devLog("No contact for this message session");
    }

    const newSession: MessageSessionType = {
      number: contact?.number || "unknown", // Default for no known number
      contact: contact !== null ? contact : null,
      messages: contactMessages,
      AESKey: sessionAESKey,
      receiversRSAPublicKey: null, // FIX THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    };

    setMessageSession(newSession);

    M_StoreMessageSession(newSession);

    navigate("/profile");
  };

  /*
    CONSIDER:
        You have the same member function in/for Contacts.tsx
        and also found in ChatsMenu.
        Consider adding it to a common utils file or helper
  */
  const M_StoreMessageSession = async (
    newSession: MessageSessionType
  ): Promise<void> => {
    try {
      await IDB_UpdateMessageSession(newSession);
    } catch (err) {
      log.logAllError(
        "Error storing message session in indexDB when clicking in chats menu",
        err
      );
    }
  };

  return (
    <div className="my-20 rounded-md bg-gray-400 p-3 m-3 text-black">
      {lastMessage ? (
        <button
          onClick={() => M_CreateMessageSession()}
          className="flex flex-col items-start justify-start"
        >
          <FaMessage />
          <p className="bg-primary mt-2 rounded-md py-2 px-3 truncate max-w-full overflow-x-hidden">
            {lastMessage.message || "..."}
          </p>
          <p className="text-xs">
            {new Date(lastMessage.sentat).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
            }) || ""}
          </p>
        </button>
      ) : (
        <p>
          No Messages <FaMessage />
        </p>
      )}
    </div>
  );
};

export default ContactProfileInfo;
