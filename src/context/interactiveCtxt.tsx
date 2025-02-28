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

import React, { createContext, ReactNode, useState } from "react";
import { MdAccountCircle } from "react-icons/md";

import { InteractiveCtxtTypes, MenuTitle } from "../types/interactiveCtxtTypes";

const InteractiveCtxt = createContext({} as InteractiveCtxtTypes);

export const InteractiveProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [openChatsMenu, setOpenChatsMenu] = useState(false);
  const [newChat, setNewChat] = useState(false);
  const [title, setTitle] = useState<MenuTitle>({
    string: "Account",
    icon: <MdAccountCircle />,
  });
  const [settingsState, setSettingsState] = useState({
    page: "main",
  });

  return (
    <InteractiveCtxt.Provider
      value={{
        setNewChat,
        setOpenChatsMenu,
        setTitle,
        setSettingsState,
        openChatsMenu,
        newChat,
        title,
        settingsState,
      }}
    >
      {children}
    </InteractiveCtxt.Provider>
  );
};

export default InteractiveCtxt;
