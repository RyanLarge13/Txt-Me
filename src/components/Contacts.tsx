import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      exit={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mt-20 w-full"
    >
      <button
        onClick={() => navigate("/profile/newcontact")}
        className="bg-primary text-[#000] p-3 w-full rounded-sm"
      >
        New Contact
      </button>
      {contacts.length > 0 ? (
        contacts.map((contact) => (
          <div key={contact.id}>
            <p>{contact.name}</p>
          </div>
        ))
      ) : (
        <p className="text-center mt-10">No Contacts</p>
      )}
    </motion.div>
  );
};

export default Contacts;
