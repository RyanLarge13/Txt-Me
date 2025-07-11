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
import React, { useContext } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  FaMailchimp,
  FaMessage,
  FaPerson,
  FaStar,
  FaTrash,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import { useConfig } from "../context/configContext.tsx";
import { useDatabase } from "../context/dbContext";
import UserCtxt from "../context/userCtxt";
import useContextMenu from "../hooks/useContextMenu.ts";
import useLogger from "../hooks/useLogger";
import useSocket from "../hooks/useSocket.ts";
import { ContactType } from "../types/contactTypes.ts";
import { ContextMenuShowType } from "../types/interactiveCtxtTypes.ts";
import { MessageSessionType, MessageType } from "../types/messageTypes.ts";
import { getInitials } from "../utils/helpers.ts";

const ChatsMenu = () => {
  const { setMessageSession, setMessageSessionsMap, messageSessionsMap } =
    useContext(UserCtxt);
  const { IDB_UpdateMessageSession, IDB_UpdateMessages, IDB_DeleteMessages } =
    useDatabase();
  const { getUserData } = useConfig();
  const { socket } = useSocket();

  const navigate = useNavigate();
  const log = useLogger();
  const contextMenu = useContextMenu();

  /*
    CONSIDER:
        You have the same member function in/for Contacts.tsx
        and also found in ContactProfileInfo.
        Consider adding it to a common utils file or helper
    FIX:
        Need to make sure the rsaPublic key and AES keys for the session
        exist and are set the way they should be set
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

  const M_UpdateMessagesAsRead = async (newMessages: MessageType[]) => {
    try {
      await IDB_UpdateMessages(newMessages);
    } catch (err) {
      log.logAllError(
        "Error updating entire session messages to read=true and readat=new Date()  in indexedDB after clicking chats menu message session div. Error: ",
        err
      );
    }
  };

  const M_SendAsReadThroughSocket = (fromNumber: string) => {
    if (!socket) {
      /*
        NOTE:
          Not sure if I need this. Probably od. Consider doing more. Like force a refresh or something
      */
      log.logAllError(
        "No socket to use to update messages as read from chats menu. Something is wrong!"
      );
      return;
    }
    try {
      socket?.emit("messages-read", fromNumber);
    } catch (err) {
      log.logAllError(
        "Error sending update through socket to update read and readat values on messages to fromNumber",
        err
      );
    }
  };

  /*
  CONSIDER:
    1. Create message session function below could be reused
    this same function is used inside of ContactProfileInfo component
*/
  const M_CreateMessageSession = (
    fromNumber: string,
    session: MessageSessionType
  ): void => {
    const contact = session.contact;
    const messages = session.messages;

    /*
      DEFINE:
        1. Update the message so it is marked as read.
        2. Send socket message to make sure sender knows message has been read
    */

    log.logAll(
      "Creating a new message session from chats menu. Logging messages and contact that is involved in chats menu session click",
      "contact: ",
      contact,
      "Messages: ",
      messages
    );

    if (!contact) {
      log.devLog("No contact for this message session");
    }

    if (M_IsUnread(session) !== "") {
      const currentAllMessages = messageSessionsMap;

      const newMessages: MessageType[] = messages.map((m: MessageType) => {
        if (m.fromnumber === fromNumber) {
          return { ...m, read: true, readat: new Date() };
        } else {
          return m;
        }
      });

      const newSession: MessageSessionType = {
        number: contact?.number || fromNumber,
        contact: contact !== null ? contact : null,
        messages: newMessages,
        AESKey: session.AESKey,
        receiversRSAPublicKey: session.receiversRSAPublicKey,
      };

      if (currentAllMessages.has(fromNumber)) {
        const messageData = currentAllMessages.get(fromNumber);

        /*
          NOTE:
            Added to satisfy typescript
        */
        if (!messageData) {
          return;
        }

        currentAllMessages.set(fromNumber, {
          contact: messageData.contact || null,
          messages: newMessages,
          AESKey: messageData.AESKey,
          receiversRSAPublicKey: session.receiversRSAPublicKey,
        });
      } else {
        log.logAllError(
          "allMEssages does not carry message session data as expected. Check ChatsMenu.tsx M_CreateMessageSession"
        );
      }

      // Trigger a new state update so the changes can be reflected in the UI
      // Unfortunately this requires an entire refresh of this component
      setMessageSessionsMap(new Map(currentAllMessages));

      M_UpdateMessagesAsRead(newMessages);
      M_StoreMessageSession(newSession);
      M_SendAsReadThroughSocket(fromNumber);

      return;
    }

    const newSession: MessageSessionType = {
      number: contact?.number || fromNumber,
      contact: contact !== null ? contact : null,
      messages: messages,
      AESKey: session.AESKey,
      receiversRSAPublicKey: session.receiversRSAPublicKey,
    };

    setMessageSession(newSession);

    navigate("/profile");
  };

  const M_IsUnread = (messageSession: {
    contact: ContactType | null;
    messages: MessageType[];
  }) => {
    const lastMessage =
      messageSession.messages[messageSession.messages.length - 1] || null;

    if (!lastMessage) {
      return "";
    }

    if (
      lastMessage.fromnumber !== getUserData("phoneNumber") &&
      lastMessage.read === false
    ) {
      return "border-t-2 border-t-primary";
    } else {
      return "";
    }
  };

  // CONTEXT MENU METHODS ------------------------------------------------------------------
  const M_DeleteMessageSession = async (messageSession: MessageSessionType) => {
    /*
      TODO:
        IMPLEMENT
          1. Remove messages from the server???? There are many things to consider
          Like if another client has the messages we don't want to make server messages unaccessible 
          to that client?? Maybe. I'm not sure
    */

    setMessageSessionsMap((prev) => {
      if (prev.has(messageSession.number)) {
        const currentMessages = prev;
        currentMessages.delete(messageSession.number);

        return new Map(currentMessages);
      } else {
        return prev;
      }
    });

    try {
      /*
        TODO:
          IMPLEMENT:
            1. Make sure that when puling this value from indexedDB
            on load that I check for null-ness
      */
      await IDB_UpdateMessageSession(null);
    } catch (err) {
      log.devLog(
        "Error removing message session from indexedDB when deleting messageSession. Error: ",
        err
      );
    }

    try {
      await IDB_DeleteMessages(messageSession.messages);
    } catch (err) {
      log.devLog(
        "Error removing messages from indexedDB when deleting messageSession. Error: ",
        err
      );
    }
  };
  // CONTEXT MENU METHODS ------------------------------------------------------------------

  const M_HandleContextMenu = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    messageSession: MessageSessionType
  ): void => {
    e.preventDefault();
    e.stopPropagation();

    const newContextMenu: ContextMenuShowType = {
      show: true,
      color: "bg-tri",
      coords: {
        x: e.clientX,
        y: e.clientY,
      },
      mainOptions: [
        { txt: "Message", icon: <FaMessage />, func: () => {} },
        { txt: "Contact", icon: <FaPerson />, func: () => {} },
        { txt: "Mark Unread", icon: <FaMailchimp />, func: () => {} },
        {
          txt: "Delete",
          icon: <FaTrash />,
          func: () => M_DeleteMessageSession(messageSession),
        },
      ],
      options: [
        { txt: "New Message", icon: <FaMessage />, func: () => {} },
        { txt: "Favorite", icon: <FaStar />, func: () => {} },
        { txt: "Hide", icon: <FaStar />, func: () => {} },
        { txt: "Delete Old", icon: <FaStar />, func: () => {} },
        { txt: "Save Images", icon: <FaStar />, func: () => {} },
      ],
    };

    contextMenu.buildContextMenu(newContextMenu);

    log.devLog("Message session in handle context menu", messageSession);
  };

  /*
    CONSIDER:
      Maybe instead of using ? every time we query the 
      last message in the message session or any message 
      in the message session. We first check to see if 
      messages has any length
  */

  return (
    <motion.nav
      initial={{ opacity: 0, x: -100 }}
      exit={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col fixed top-14 left-0 right-0 md:right-[75%] z-40 bottom-0
      overflow-y-auto bg-[#000]"
    >
      <div className="sticky top-10 mx-5 right-0 left-0">
        <button
          onClick={() => {
            setMessageSession(null);
            navigate("/profile/contacts");
          }}
          className="bg-primary p-3 rounded-sm w-full mt-5 text-[#000]"
        >
          New Chat
        </button>
      </div>
      <div className="text-white w-full h-full mt-20">
        {Array.from(messageSessionsMap).map(([fromNumber, messageSession]) => (
          <div
            key={fromNumber}
            onContextMenu={(e) =>
              M_HandleContextMenu(e, { number: fromNumber, ...messageSession })
            }
            onClick={() =>
              M_CreateMessageSession(fromNumber, {
                number: fromNumber,
                ...messageSession,
              })
            }
            className={`flex justify-between items-center relative bg-[#222] border-b-black border-b h-[80px] max-w-full duration-200 hover:bg-[#333] ${
              // If the last message is not sent by the user and is
              // unread call this member method and change the top border color
              M_IsUnread(messageSession)
            }`}
          >
            {/* Contact avatar and name */}
            <div className="flex flex-col justify-center items-center basis-1/6 p-3">
              {messageSession.contact?.avatar ? (
                <img
                  src={URL.createObjectURL(messageSession?.contact?.avatar)}
                  alt={getInitials(messageSession.contact.name) || fromNumber}
                  width={30}
                  height={30}
                  className="w-[35px] h-[35px] rounded-full object-cover"
                />
              ) : (
                <p className="text-lg text-center">
                  {messageSession.contact
                    ? getInitials(messageSession.contact.name)
                    : fromNumber}
                </p>
              )}
              <p className="text-center whitespace-nowrap">
                {messageSession?.contact?.nickname || ""}
              </p>
            </div>
            {/* Last message and time */}
            <div className="flex flex-col justify-center py-2 items-start gap-y-2 h-full basis-3/5 overflow-hidden pr-5">
              <p
                className={`self-start w-full truncate ${
                  messageSession?.messages[messageSession?.messages.length - 1]
                    ?.fromnumber === getUserData("phoneNumber")
                    ? "text-primary"
                    : "text-secondary"
                }`}
              >
                {messageSession?.messages[messageSession?.messages.length - 1]
                  ?.message || ""}
              </p>
              <p className="text-xs">
                {new Date(
                  messageSession.messages[messageSession?.messages.length - 1]
                    ?.sentat || new Date()
                ).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </div>
            <button
              className="p-3"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                M_HandleContextMenu(e, {
                  // Pass in the "number" key and its value to satisfy type
                  number: fromNumber,
                  contact: messageSession.contact,
                  messages: messageSession.messages,
                  AESKey: messageSession.AESKey,
                  receiversRSAPublicKey: null,
                })
              }
            >
              <BsThreeDotsVertical />
            </button>
          </div>
        ))}
      </div>
    </motion.nav>
  );
};

export default ChatsMenu;
