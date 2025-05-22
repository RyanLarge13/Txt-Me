import React from "react";
import { useLocation } from "react-router-dom";

import { MessageSessionType } from "../types/userTypes";

const MessageInfoTopBar = ({
  messageSession,
}: {
  messageSession: MessageSessionType;
}) => {
  const location = useLocation();

  return location.pathname === "/profile" ? (
    <div className="p-5 text-sm mt-20 flex justify-between items-center bg-black">
      <p className="hover:text-primary duration-200 cursor-pointer">
        {messageSession.contact?.name || messageSession.number}
      </p>
      <p className="text-tri">{messageSession.contact?.number || ""}</p>
    </div>
  ) : null;
};

export default MessageInfoTopBar;
