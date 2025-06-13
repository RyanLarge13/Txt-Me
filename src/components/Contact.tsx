import React, { useContext, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import {
    Fa42Group, FaMessage, FaPerson, FaPhone, FaShare, FaStar, FaStop, FaTrash, FaVideo
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import { useConfig } from "../context/configContext";
import { useDatabase } from "../context/dbContext";
import UserCtxt from "../context/userCtxt";
import useContextMenu from "../hooks/useContextMenu";
import useLogger from "../hooks/useLogger";
import useNotifActions from "../hooks/useNotifActions";
import { Contacts as ContactType } from "../types/userTypes";
import { API_DeleteContact } from "../utils/api";
import { getInitials } from "../utils/helpers";

const Contact = ({
  contact,
  startMessage,
}: {
  contact: ContactType;
  startMessage: (contact: ContactType) => void;
}) => {
  const { addSuccessNotif } = useNotifActions();
  const { IDB_DeleteContact } = useDatabase();
  const { getUserData } = useConfig();
  const { setContacts } = useContext(UserCtxt);
  const contextMenu = useContextMenu();

  const [expand, setExpand] = useState(false);

  const navigate = useNavigate();
  const log = useLogger();

  const token = getUserData("authToken");

  // CONTEXT_MENU_METHODS ----------------------------------------------------------------
  const M_DeleteContact = () => {
    const continueRequest = async () => {
      try {
        await IDB_DeleteContact(contact.contactid);

        // Remove contact immediately after a successful deletion from IndexedDB
        setContacts((prev: ContactType[]) => {
          const newCs = prev.filter(
            (c: ContactType) => c.contactid !== contact.contactid
          );

          return newCs;
        });

        await API_DeleteContact(token, contact.contactid);
      } catch (err) {
        log.logAllError(
          "Error when removing contact from IndexedDB or from server",
          err
        );
      }
    };

    addSuccessNotif(
      "Delete Contact",
      "Are you sure you want to delete this contact?",
      true,
      [{ text: "confirm", func: continueRequest }]
    );
  };
  // CONTEXT_MENU_METHODS ----------------------------------------------------------------

  const M_HandleContextMenu = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    e.preventDefault();
    e.stopPropagation();

    const newContextMenu = {
      show: true,
      color: "#fff",
      coords: {
        x: e.clientX,
        y: e.clientY,
      },
      mainOptions: [
        {
          txt: "Edit",
          icon: <FaEdit />,
          func: () => {
            navigate(`/profile/contacts/${contact.contactid}`);
          },
        },
        { txt: "New", icon: <FaPerson />, func: () => {} },
        { txt: "Delete", icon: <FaTrash />, func: M_DeleteContact },
        { txt: "Block", icon: <FaStop />, func: () => {} },
      ],
      options: [
        { txt: "Favorite", icon: <FaStar />, func: () => {} },
        { txt: "New Message", icon: <FaMessage />, func: () => {} },
        { txt: "Video Chat", icon: <FaVideo />, func: () => {} },
        { txt: "Group", icon: <Fa42Group />, func: () => {} },
        { txt: "Share", icon: <FaShare />, func: () => {} },
      ],
    };

    contextMenu.buildContextMenu(newContextMenu);
  };

  const M_HandleStartMessage = (
    e: React.MouseEvent<HTMLButtonElement>,
    contactArg: ContactType
  ) => {
    e.stopPropagation();
    startMessage(contactArg);
  };

  return (
    <div className="flex flex-col justify-start items-center">
      <div
        onClick={() => setExpand((prev) => !prev)}
        className="flex justify-between items-center py-5 bg-black w-full"
      >
        {contact.avatar ? (
          <img
            src={contact?.avatar}
            alt="avatar"
            width={30}
            height={30}
            className="w-[30px] h-[30px] rounded-full object-contain"
          />
        ) : (
          <p className="flex justify-center items-center w-[40px] h-[40px] text-black rounded-full bg-slate-400">
            {getInitials(contact.name || "")}
          </p>
        )}
        <p>{contact.name}</p>
        <button onClick={M_HandleContextMenu}>
          <BsThreeDotsVertical />
        </button>
      </div>
      {/* Expandable contact information on click */}
      <div
        className={`duration-200 w-full ${
          expand
            ? "h-[250px] opacity-100 pointer-events-auto"
            : "h-0 pointer-events-none opacity-0"
        }`}
      >
        <div className="flex justify-start mb-1 items-center gap-x-2">
          <p className="text-gray-400">Mobile</p>
          <p>{contact.number}</p>
        </div>
        <div className="flex justify-start mb-1 items-center gap-x-2">
          <p className="text-gray-400">Email</p>
          <a
            href={`mailto:${contact.email}`}
            className="hover:text-tri duration-200"
          >
            {contact.email}
          </a>
        </div>
        <div className="flex justify-start mb-5 items-center gap-x-2">
          <p className="text-gray-400">Space</p>
          <p className="p-1 rounded-md bg-tri text-black">{contact.space}</p>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={() => {}}
            className="basis-1/3 max-w-[100px] aspect-square hover:bg-tri duration-200 hover:text-white text-black rounded-full bg-primary m-6 text-xs gap-y-1 flex flex-col justify-center items-center"
          >
            <p>Call</p>
            <FaPhone />
          </button>
          <button
            onClick={(e) => M_HandleStartMessage(e, contact)}
            className="basis-1/3 max-w-[100px] aspect-square hover:bg-tri duration-200 hover:text-white text-black rounded-full bg-primary m-6 text-xs gap-y-1 flex flex-col justify-center items-center"
          >
            <p>Message</p>
            <FaMessage />
          </button>
          <button
            onClick={() => {}}
            className="basis-1/3 max-w-[100px] aspect-square hover:bg-tri duration-200 hover:text-white text-black rounded-full bg-primary m-6 text-xs gap-y-1 flex flex-col justify-center items-center"
          >
            <p>Video</p>
            <FaVideo />
          </button>
        </div>
      </div>
      {/* Expandable contact information on click */}
    </div>
  );
};

export default Contact;
