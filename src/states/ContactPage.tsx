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
import React, { useContext, useEffect, useState } from "react";
import { FaAddressCard, FaLink, FaUser, FaUserTag } from "react-icons/fa";
import { FaMobileScreen, FaUserGroup } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

import ContactProfileInfo from "../components/ContactProfileInfo";
import { useConfig } from "../context/configContext";
import { useDatabase } from "../context/dbContext";
import UserCtxt from "../context/userCtxt";
import useLogger from "../hooks/useLogger";
import useNotifActions from "../hooks/useNotifActions";
import { ContactType } from "../types/contactTypes";
import { API_UpdateContact } from "../utils/api";
import { contactFromFormState, getInitials } from "../utils/helpers";

const ContactPage = () => {
  const { contacts } = useContext(UserCtxt);
  const { addSuccessNotif } = useNotifActions();
  const { IDB_UpdateContact } = useDatabase();
  const { getUserData } = useConfig();

  const [formState, setFormState] = useState<ContactType>({
    contactid: "",
    createdat: new Date(),
    name: "",
    nickname: "",
    avatar: null,
    number: "",
    address: "",
    website: "",
    email: "",
    space: "",
    synced: false,
  });

  const [autoComplete, setAutoComplete] = useState({
    show: formState.space ? true : false,
    names: [],
  });

  const params = useParams();
  const navigate = useNavigate();
  const log = useLogger();
  const token = getUserData("authToken");

  const contactId = params.id;

  const contact: ContactType | undefined = contacts.find(
    (c: ContactType) => c.contactid === contactId
  );

  useEffect(() => {
    if (contact) {
      setFormState(contact);
    } else {
      /*
        TODO:
          IMPLEMENT:
            1. Instead of navigating back here and adding this broken state
            to history, instead popstate and remove this route from history
      */
      navigate("/profile/contacts");
    }
  }, []);

  useEffect((): void => {
    if (formState.space === "") {
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
  }, [formState.space]);

  // Loading logic ---------

  const M_UpdateContact = async (e: React.FormEvent | null): Promise<void> => {
    e?.preventDefault();
    /*
      TODO:
        IMPLEMENT:
          1. Validate this new contact below
    */
    const newContact: ContactType = contactFromFormState(formState, contact);

    try {
      await IDB_UpdateContact(newContact);
    } catch (err) {
      log.logAllError("Error updating the contact to indexedDB. Error: ", err);
    }

    try {
      await API_UpdateContact(token, newContact);
    } catch (err) {
      log.logAllError("Error updating contact to server. Error: ", err);
    }
  };

  const M_ConfirmQuit = () => {
    addSuccessNotif(
      "Save Changes?",
      "If you choose not to save your changes they will be lost forever",
      true,
      [
        { text: "leave", func: () => navigate("/profile/contacts") },
        { text: "save", func: () => M_UpdateContact(null) },
      ]
    );
  };

  const M_UploadAvatar = (e): void => {
    const newAvatarFile = e?.target.files[0];
    setFormState((prev) => ({ ...prev, avatar: newAvatarFile }));
    log.devLog(newAvatarFile);
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
      className="fixed py-20 inset-0 z-[999] bg-[#000] overflow-y-auto small-scrollbar"
    >
      {contact !== undefined ? (
        <form onSubmit={M_UpdateContact}>
          {/* Changed! ------------------------------------------------------------------ */}
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
              {formState.avatar !== null ? (
                <img
                  src={URL.createObjectURL(formState.avatar)}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : contact?.avatar ? (
                <img
                  src={URL.createObjectURL(contact.avatar)}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <p className="text-4xl">{getInitials(contact.name)}</p>
              )}
            </label>
          </div>
          <ContactProfileInfo contact={contact} />
          <div className="mt-40 px-5">
            <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
              <FaUser />
              <input
                type="text"
                name="name"
                value={formState.name}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, name: e.target.value }))
                }
                className="bg-[#000] focus:outline-none"
                placeholder={contact.name || "Name"}
              />
            </div>
            <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
              <FaUserTag />
              <input
                type="text"
                name="nickname"
                value={formState.nickname}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    nickname: e.target.value,
                  }))
                }
                className="bg-[#000] focus:outline-none"
                placeholder={contact.nickname || "Nickname"}
              />
            </div>
            <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
              <button
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="p-2 rounded-md bg-primary hover:bg-tri duration-200 text-black"
              >
                <FaMobileScreen />
              </button>
              <input
                type="tel"
                name="phonenumber"
                value={formState.number}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, number: e.target.value }))
                }
                className="bg-[#000] focus:outline-none"
                placeholder={contact.number || "Mobile"}
              />
            </div>
            <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
              <a
                href={`mailto:${contact.email}`}
                className="p-2 rounded-md bg-primary hover:bg-tri duration-200 text-black"
              >
                <MdEmail />
              </a>
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, email: e.target.value }))
                }
                className="bg-[#000] focus:outline-none"
                placeholder={contact.email || "Email"}
              />
            </div>
            <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${contact.address}`}
                className="p-2 rounded-md bg-primary hover:bg-tri duration-200 text-black"
              >
                <FaAddressCard />
              </a>
              <input
                type="text"
                name="address"
                value={formState.address}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, address: e.target.value }))
                }
                className="bg-[#000] focus:outline-none truncate"
                placeholder={contact.address || "Address"}
              />
            </div>
            <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
              <a
                target="_blank"
                href={`${contact.website}`}
                className="p-2 block rounded-md bg-primary hover:bg-tri duration-200 text-black"
              >
                <FaLink />
              </a>
              <input
                type="url"
                name="website"
                value={formState.website}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, website: e.target.value }))
                }
                className="bg-[#000] focus:outline-none"
                placeholder={contact.website || "Website"}
              />
            </div>
            <div className="relative">
              <div className="flex gap-x-5 justify-start items-center w-full p-2 my-10 rounded-sm">
                <FaUserGroup />
                <input
                  type="text"
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, group: e.target.value }))
                  }
                  value={formState.space}
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
              onClick={() => M_ConfirmQuit()}
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
      ) : null}
    </motion.section>
  );
};

export default ContactPage;
