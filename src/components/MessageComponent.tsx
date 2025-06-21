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
import React from "react";
import { BiSolidMessageCheck } from "react-icons/bi";
import { BsFillSendExclamationFill, BsSendCheckFill } from "react-icons/bs";
import { MdFace, MdOutlineScheduleSend } from "react-icons/md";

import EyeEmojiRead from "../assets/svg-animations/read.svg";
import useContextMenu from "../hooks/useContextMenu";
import useUserData from "../hooks/useUserData";
import { ContextMenuShowType } from "../types/interactiveCtxtTypes";
import { Message } from "../types/userTypes";

const MessageComponent = ({
  message,
  length,
  index,
}: {
  message: Message;
  length: number;
  index: number;
}): JSX.Element => {
  const contextMenu = useContextMenu();

  /*
    CONSIDER:
      1. Should I pass in phone number from parent? Parent already has phone number??
  */
  const [phoneNumber] = useUserData("phoneNumber");
  const isFromMe = message.fromnumber === phoneNumber;

  const deliveredDate = message.deliveredat
    ? new Date(message.deliveredat).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      })
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
        isFromMe ? "self-end items-end" : "self-end items-start"
      }`}
    >
      <p className="mr-3 whitespace-nowrap flex gap-x-2 text-xs">
        {isFromMe ? (
          <>
            {/*
              CONSIDER:
                Adding these checks up top to reuse and also 
                change the color of the message container
            */}
            {message.sent && !message.delivered
              ? sentDate
              : message.sent && message.delivered
              ? deliveredDate
              : "FAILED"}
            <span>
              {message.sent && !message.delivered ? (
                <MdOutlineScheduleSend className="text-primary" />
              ) : message.sent && message.delivered ? (
                <BsSendCheckFill className="text-tri" />
              ) : (
                <BsFillSendExclamationFill className="text-secondary" />
              )}
            </span>
          </>
        ) : (
          <>
            {deliveredDate}
            <span>
              <BiSolidMessageCheck className="text-tri" />
            </span>
          </>
        )}
      </p>
      <div
        onContextMenu={M_HandleContextMenu}
        className={`${
          isFromMe ? "bg-tri" : "bg-secondary"
        } rounded-lg shadow-lg relative text-black p-3 outline-red-400 min-w-[50%]`}
      >
        <p>{message.message}</p>
        {index + 1 === length && message.read ? (
          <motion.img
            src={EyeEmojiRead}
            alt="👀"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-[15px] h-[15px] right-[-5px] bottom-[-5px]"
          />
        ) : null}
      </div>
    </div>
  );
};

export default MessageComponent;
