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
import { FormEvent, useEffect, useState } from "react";
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

import { useDatabase } from "../context/dbContext";
import useLogger from "../hooks/useLogger";
import { DraftType } from "../types/dbCtxtTypes";

/*
  TODO:
    IMPLEMENT:
      1. Save the current contact in like a draft state inside indexedDB
      when navigating away from the new contact state or by pressing cancel
*/
const NewContact = (): JSX.Element => {
  const { IDB_UpdateContactInDraft } = useDatabase();

  /*
    TODO:
      IMPLEMENT:
        1. Make a more complex avatar image state with image type checking 
        and other data to make sure the user uploads a good image
  */
  const [avatarImage, setAvatarImage] = useState(null);
  const [groupText, setGroupText] = useState("");
  const [autoComplete, setAutoComplete] = useState({
    show: groupText ? true : false,
    names: [],
  });

  const navigate = useNavigate();
  const log = useLogger();

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
    window.addEventListener("popstate", M_SaveContactInDraft);

    return () => window.removeEventListener("popstate", M_SaveContactInDraft);
  }, []);

  const M_AddContact = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData.entries());

    log.devLog("Data from contact form: ", data);
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
      /*
        TODO:
          IMPLEMENT:
            1. Change the way I handle form state so this object
            can be updated appropriately
      */
      const contactToSaveAsDraft: DraftType["contact"] = {
        contactid: 0,
        name: "",
        email: "",
        number: "",
        createdat: "",
        space: "",
        nickname: "",
        address: "",
        website: "",
        avatar: null,
      };
      await IDB_UpdateContactInDraft(contactToSaveAsDraft);
    } catch (err) {
      log.logAllError("Error saving contact in drafts. Error: ", err);
    }
    navigate("/profile/contacts");
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
              className="bg-[#000] focus:outline-none"
              placeholder="Nickname"
            />
          </div>
          <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
            <FaMobileScreen />
            <input
              type="tel"
              name="phonenumber"
              className="bg-[#000] focus:outline-none"
              placeholder="Mobile"
            />
          </div>
          <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
            <MdEmail />
            <input
              type="email"
              name="email"
              className="bg-[#000] focus:outline-none"
              placeholder="Email"
            />
          </div>
          <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
            <FaAddressCard />
            <input
              type="text"
              name="address"
              className="bg-[#000] focus:outline-none"
              placeholder="Address"
            />
          </div>
          <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
            <FaLink />
            <input
              type="url"
              name="website"
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
      </form>
    </motion.section>
  );
};

export default NewContact;
