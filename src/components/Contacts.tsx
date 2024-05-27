import React, { useState } from "react";
import { motion } from "framer-motion";

const Contacts = () => {
 const [contacts, setContacts] = useState([]);

 return (
  <motion.div
   initial={{ y: "100%", opacity: 0 }}
   exit={{ y: "100%", opacity: 0 }}
   animate={{ y: 0, opacity: 1 }}
   className="mt-20 w-full"
  >
   <button className="bg-primary text-[#000] p-3 w-full rounded-sm">New Contact</button>
   {contacts.length > 0 ? (
    contacts.map(contact => (
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
