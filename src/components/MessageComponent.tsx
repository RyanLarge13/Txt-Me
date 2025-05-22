import React from "react";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import { MdFace } from "react-icons/md";

import useContextMenu from "../hooks/useContextMenu";
import useUserData from "../hooks/useUserData";
import { ContextMenuShowType } from "../types/interactiveCtxtTypes";
import { Message } from "../types/userTypes";

const MessageComponent = ({ message }: { message: Message }): JSX.Element => {
  const contextMenu = useContextMenu();

  /*
    CONSIDER:
      1. Should I pass in phone number from parent? Parent already has phone number??
  */
  const [phoneNumber] = useUserData("phoneNumber");
  const isFromMe = message.fromnumber === phoneNumber;

  const deliveredDate = message.deliveredat
    ? new Date(message.deliveredat).toLocaleTimeString()
    : "";
  const sentDate = message.sentat
    ? new Date(message.sentat).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      })
    : "";

  const M_HandleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const newContextMenu: ContextMenuShowType = {
      show: true,
      color: "#222",
      coords: { x: e.clientX, y: e.clientY },
      mainOptions: [
        { txt: "My Icon", icon: <MdFace />, func: () => {} },
        { txt: "My Icon", icon: <MdFace />, func: () => {} },
        { txt: "My Icon", icon: <MdFace />, func: () => {} },
        { txt: "My Icon", icon: <MdFace />, func: () => {} },
      ],
      options: [
        { txt: "My Icon", icon: <MdFace />, func: () => {} },
        { txt: "My Icon", icon: <MdFace />, func: () => {} },
        { txt: "My Icon", icon: <MdFace />, func: () => {} },
        { txt: "My Icon", icon: <MdFace />, func: () => {} },
        { txt: "My Icon", icon: <MdFace />, func: () => {} },
      ],
    };

    contextMenu.buildContextMenu(newContextMenu);
  };

  return (
    <div
      className={`flex justify-center ${
        isFromMe ? "self-end items-end" : "self-start items-start"
      }`}
    >
      <p
        className={`mr-3 whitespace-nowrap flex gap-x-2 ${
          isFromMe ? "self-end" : "self-start"
        } text-xs`}
      >
        {isFromMe ? sentDate : deliveredDate}
        {isFromMe ? (
          <span
            className={`${
              message.delivered ? "text-primary" : "text-secondary"
            }`}
          >
            {message.delivered ? <FaCheckCircle /> : <FaClock />}
          </span>
        ) : null}
      </p>
      <div
        onContextMenu={M_HandleContextMenu}
        className={`${
          isFromMe ? "bg-tri" : "bg-secondary"
        } rounded-lg shadow-lg text-black p-3 outline-red-400 min-w-[50%]`}
      >
        <p>{message.message}</p>
      </div>
    </div>
  );
};

export default MessageComponent;
