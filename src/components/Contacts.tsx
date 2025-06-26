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
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDatabase } from "../context/dbContext";
import UserCtxt from "../context/userCtxt";
import useLogger from "../hooks/useLogger";
import useNotifActions from "../hooks/useNotifActions";
import {
  Contacts as ContactType,
  MessageSessionType,
} from "../types/userTypes";
import { defaultContact } from "../utils/constants";
import { Crypto_GenAESKey } from "../utils/crypto";
import { normalizePhoneNumber as npn, tryCatch } from "../utils/helpers";
import Contact from "./Contact";

const Contacts = ({ contacts }: { contacts: ContactType[] }) => {
  const { allMessages, setMessageSession, setAllMessages } =
    useContext(UserCtxt);
  const { addErrorNotif } = useNotifActions();
  const { IDB_UpdateMessageSession } = useDatabase();

  const [searchedContacts, setSearchedContacts] = useState(contacts);
  const [phoneNumberSearchText, setPhoneNumberSearchText] = useState("");

  const navigate = useNavigate();
  const log = useLogger();

  useEffect(() => {
    const searchNumber = phoneNumberSearchText;

    if (searchNumber !== "") {
      setSearchedContacts((prev) => {
        return prev.filter((c: ContactType) =>
          npn(c.number).includes(npn(searchNumber))
        );
      });
    } else {
      setSearchedContacts(contacts);
    }
  }, [phoneNumberSearchText, contacts]);

  // You have the same member function in/for ChatsMenu.tsx
  // Consider adding it to a common utils file or helper
  const M_StoreSession = async (
    newSession: MessageSessionType
  ): Promise<void> => {
    try {
      await IDB_UpdateMessageSession(newSession);
    } catch (err) {
      log.logAllError(
        "Error saving new session to indexedDB when clicking contact",
        err
      );
    }
  };

  const M_StartMessage = async (contact: ContactType) => {
    const newSessionDefault: MessageSessionType = {
      number: "",
      contact: null,
      messages: [],
      AESKey: null,
      receiversRSAPublicKey: null,
    };

    // Default contact id from constants provides a default contactid of ""
    if (!contact.contactid && phoneNumberSearchText === "") {
      addErrorNotif(
        "Missing Number",
        "Please at least provide a phone number",
        false,
        []
      );
      return;
    }

    if (!contact.contactid) {
      const foundContact =
        contacts.find(
          (c: ContactType) => npn(c.number) === npn(phoneNumberSearchText)
        ) || null;

      if (foundContact !== null) {
        newSessionDefault.number = foundContact.number;
        newSessionDefault.contact = foundContact;
      } else {
        newSessionDefault.number = phoneNumberSearchText;
        newSessionDefault.contact = null;
      }
    } else {
      newSessionDefault.number = contact.number;
      newSessionDefault.contact = contact;
    }

    if (allMessages.has(contact.number)) {
      // Immediately set message session to the contact stored and messages found
      // and nothing else
      newSessionDefault.messages =
        allMessages.get(contact.number)?.messages || [];
      setMessageSession(newSessionDefault);
    } else {
      // First update our map and then create the message session
      const { data: newAESKey, error: AESKeyGenError } =
        await tryCatch<CryptoKey>(Crypto_GenAESKey);

      if (AESKeyGenError || !newAESKey) {
        throw new Error(
          `Error generating new AES key. Check crypto.ts. ${AESKeyGenError}`
        );
      }

      allMessages.set(contact.number, {
        contact: contact.contactid ? contact : null,
        messages: [],
        AESKey: newAESKey,
      });

      setAllMessages(new Map(allMessages));
      setMessageSession(newSessionDefault);
    }

    M_StoreSession(newSessionDefault);

    navigate("/profile");
  };

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      exit={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mt-20 w-full pb-20"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          M_StartMessage({
            ...defaultContact,
            number: phoneNumberSearchText,
          });
        }}
      >
        <input
          onChange={(e) => setPhoneNumberSearchText(e.target.value)}
          className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
          placeholder="Type a phone number ..."
          type="text"
        />
      </form>
      <button
        onClick={() => navigate("/profile/newcontact")}
        className="bg-primary text-[#000] p-3 w-full rounded-sm"
      >
        New Contact
      </button>
      {searchedContacts.length > 0 ? (
        searchedContacts.map((contact: ContactType) => (
          <Contact
            key={contact.contactid}
            contact={contact}
            startMessage={M_StartMessage}
          />
        ))
      ) : (
        <p className="text-center mt-10">No Contacts</p>
      )}
    </motion.div>
  );
};

export default Contacts;
