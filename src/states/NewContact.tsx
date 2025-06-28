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

/*
  TODO:
    IMPLEMENT:
      1. Big Deal!!!!!!!!!!!! Need to make this component and NewContact component 
      a singular reusable component sense they are the exact same 
*/

import { motion } from "framer-motion";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import {
  FaAddressCard,
  FaCamera,
  FaLink,
  FaUser,
  FaUserTag,
} from "react-icons/fa";
import { FaMobileScreen, FaUserGroup } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { useConfig } from "../context/configContext";
import { useDatabase } from "../context/dbContext";
import UserCtxt from "../context/userCtxt";
import useLogger from "../hooks/useLogger";
import useNotifActions from "../hooks/useNotifActions";
import { ContactType } from "../types/contactTypes";
import { DraftType } from "../types/dbCtxtTypes";
import { API_AddContact } from "../utils/api";

/*
  DEFINITION:
    1. Create a new contact with form validation and functionality
    for saving a contact to drafts that will automatically 
    load up the next time the user navigates to this page
*/
const NewContact = (): JSX.Element => {
  const {
    IDB_UpdateContactInDraft,
    IDB_ClearContactDraft,
    IDB_GetDrafts,
    IDB_AddContact,
  } = useDatabase();
  const { setContacts, setMessageSessionsMap, contacts } = useContext(UserCtxt);
  const { addErrorNotif } = useNotifActions();
  const { getUserData } = useConfig();

  /*
    TODO:
      IMPLEMENT:
        1. Make a more complex avatar image state with image type checking 
        and other data to make sure the user uploads a good image
  */
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");

  const [groupText, setGroupText] = useState("");
  const [autoComplete, setAutoComplete] = useState({
    show: groupText ? true : false,
    names: [],
  });

  const navigate = useNavigate();
  const log = useLogger();

  const token = getUserData("authToken");

  useEffect((): void => {
    if (groupText === "") {
      setAutoComplete((prev) => {
        return { ...prev, show: false };
      });
    } else {
      /*
        TODO:
          IMPLEMENT:
            1. Query for the groups that already exist for the user
      */
      setAutoComplete((prev) => {
        return { ...prev, show: true };
      });
    }
  }, [groupText]);

  // Save contact in drafts (IndexedDB) when navigating away
  useEffect(() => {
    // Add in draft fetch from indexedDB as well in this setup use effect
    M_LoadContactDraft();

    window.addEventListener("popstate", M_SaveContactInDraft);

    return () => window.removeEventListener("popstate", M_SaveContactInDraft);
  }, []);

  const M_AddContactToIndexedDB = async (
    contactToAdd: ContactType
  ): Promise<void> => {
    try {
      await IDB_AddContact(contactToAdd);
    } catch (err) {
      log.logAllError("Error adding new contact to IndexedDB. Error: ", err);
    }

    // No longer want to keep a draft stored in memory
    try {
      await IDB_ClearContactDraft();
    } catch (err) {
      log.logAllError(
        "Error clearing the contact draft in IndexedDB. Error: ",
        err
      );
    }

    setMessageSessionsMap((prev) => {
      const messageSessions = prev;

      const currentSession = messageSessions.get(contactToAdd.number);

      if (currentSession) {
        messageSessions.set(contactToAdd.number, {
          contact: contactToAdd,
          messages: currentSession.messages || [],
          AESKey: currentSession.AESKey,
          receiversRSAPublicKey: currentSession.receiversRSAPublicKey,
        });

        return messageSessions;
      } else {
        return prev;
      }
    });
  };

  const M_AddContactToServer = async (
    contactToAdd: ContactType
  ): Promise<void> => {
    try {
      await API_AddContact(token, contactToAdd);

      contactToAdd.synced = true;
      await IDB_UpdateContactInDraft(contactToAdd);
    } catch (err) {
      log.logAllError("Error saving contact to server", err);
    }
  };

  /*
    DESC:
      This function handles adding a new contact to state an indexedDB
      for instant reaction times and immediately after sending 
      the new contact to the server to be saved remotely
  */
  const M_AddContact = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    /*
      NOTE:
        1. Cannot add two contacts with the same phone number
    */
    const phoneNumberExits = contacts.find(
      (c: ContactType) => c.number === phoneNumber
    );

    if (phoneNumberExits) {
      addErrorNotif(
        "Oops",
        "A contact with this number already exists",
        true,
        []
      );
      return;
    }

    const contactToAdd = {
      contactid: uuidv4(),
      name: name,
      email: email,
      number: phoneNumber,
      createdat: new Date(),
      space: groupText || "primary",
      nickname: nickname,
      address: address,
      website: website,
      avatar: null,
      synced: false,
    };

    setContacts((prev) => [...prev, contactToAdd]);

    M_AddContactToIndexedDB(contactToAdd);
    M_AddContactToServer(contactToAdd);

    navigate("/profile/contacts");
  };

  const M_LoadContactDraft = async (): Promise<void> => {
    const drafts = await IDB_GetDrafts();

    const IDB_Contact = drafts.contact || null;

    // Only if the contact exists in draft, otherwise do nothing
    if (IDB_Contact) {
      setAvatarImage(IDB_Contact.avatar);
      setName(IDB_Contact.name);
      setNickname(IDB_Contact.nickname);
      setPhoneNumber(IDB_Contact.number);
      setEmail(IDB_Contact.email);
      setAddress(IDB_Contact.address);
      setWebsite(IDB_Contact.website);
    }
  };

  // Handling the uploading of an Avatar image form input field,
  // setting the image to state and showing it in the contact avatar window
  const M_UploadAvatar = (e): void => {
    const newAvatarFile = e?.target.files[0];
    setAvatarImage(newAvatarFile);
    log.devLog(newAvatarFile);
  };

  const M_SaveContactInDraft = async (): Promise<void> => {
    try {
      const contactToSaveAsDraft: DraftType["contact"] = {
        contactid: uuidv4(),
        name: name,
        email: email,
        number: phoneNumber,
        createdat: new Date(),
        space: groupText || "primary",
        nickname: nickname,
        address: address,
        website: website,
        avatar: avatarImage,
        synced: false,
      };
      await IDB_UpdateContactInDraft(contactToSaveAsDraft);
    } catch (err) {
      log.logAllError("Error saving contact in drafts. Error: ", err);
    }
    navigate("/profile/contacts");
  };

  const M_HandleClearDrafts = async (e): Promise<void> => {
    e.preventDefault();

    setAvatarImage(null);
    setName("");
    setNickname("");
    setPhoneNumber("");
    setEmail("");
    setAddress("");
    setWebsite("");

    await IDB_ClearContactDraft();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: "100%" }}
      exit={{ opacity: 0, y: "100%" }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, type: "spring" },
      }}
      className="fixed inset-0 z-[999] bg-[#000] overflow-y-auto small-scrollbar"
    >
      <form onSubmit={M_AddContact}>
        <div className="flex justify-center items-center h-40 pt-20">
          <label
            className="rounded-full w-40 h-40 flex justify-center
     items-center bg-[#111] cursor-pointer"
          >
            <input
              type="file"
              accept=".jpeg .png .svg .webp .jpg"
              onChange={M_UploadAvatar}
              name="avatar"
              className="hidden"
            />
            {avatarImage !== null ? (
              <img
                src={URL.createObjectURL(avatarImage)}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <FaCamera className="text-2xl text-primary" />
            )}
          </label>
        </div>
        <div className="mt-40 px-5">
          <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
            <FaUser />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              className="bg-[#000] focus:outline-none"
              placeholder="Name"
            />
          </div>
          <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
            <FaUserTag />
            <input
              type="text"
              name="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="bg-[#000] focus:outline-none"
              placeholder="Nickname"
            />
          </div>
          <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
            <FaMobileScreen />
            <input
              type="tel"
              name={phoneNumber}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-[#000] focus:outline-none"
              placeholder="Mobile"
            />
          </div>
          <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
            <MdEmail />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#000] focus:outline-none"
              placeholder="Email"
            />
          </div>
          <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
            <FaAddressCard />
            <input
              type="text"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-[#000] focus:outline-none"
              placeholder="Address"
            />
          </div>
          <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
            <FaLink />
            <input
              type="url"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="bg-[#000] focus:outline-none"
              placeholder="Website"
            />
          </div>
          <div className="relative">
            <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
              <FaUserGroup />
              <input
                type="text"
                onChange={(e) => setGroupText(e.target.value)}
                value={groupText}
                name="group"
                className="bg-[#000] focus:outline-none"
                placeholder="Group"
              />
            </div>
            {autoComplete.show ? (
              <select className="w-full absolute bottom-[-25px] bg-tri"></select>
            ) : null}
          </div>
        </div>
        <div className="flex justify-evenly items-center mb-10 mt-20">
          <button
            type="button"
            className="bg-secondary px-10 py-3 flex-[0.25] text-[#000]"
            onClick={() => M_SaveContactInDraft()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary flex-[0.25] px-10 py-3 text-[#000]"
          >
            Save
          </button>
        </div>
        <button
          type="button"
          onClick={M_HandleClearDrafts}
          className="bg-tri flex-[0.25] px-10 py-3 text-[#000] w-full"
        >
          Clear Values
        </button>
      </form>
    </motion.section>
  );
};

export default NewContact;
