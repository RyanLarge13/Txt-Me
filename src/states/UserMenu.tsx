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

import { AnimatePresence, motion } from "framer-motion";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import BackDrop from "../components/BackDrop";
import Logout from "../components/Logout";
import MainSettings from "../components/MainSettings";
import InteractiveCtxt from "../context/interactiveCtxt";

const UserMenu = (): JSX.Element => {
  const { title, setTitle, settingsState, setSettingsState } =
    useContext(InteractiveCtxt);

  const navigate = useNavigate();

  return (
    <>
      <BackDrop close={() => navigate(-1)} />
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        exit={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-none fixed top-[-20px] bottom-[60%] left-0 right-0 z-40 bg-gradient-to-t from-secondary to-primary rounded-b-lg flex justify-center items-start pt-20 text-4xl font-bold text-black"
      >
        <div className="flex justify-center items-center gap-x-2">
          {title.icon}
          {title.string}
        </div>
      </motion.div>
      <div className="fade-inset-black fixed z-50 top-40 bottom-[-20px] right-10 left-10 lg:left-[80%] rounded-md overflow-hidden">
        <motion.nav
          initial={{ opacity: 0, y: 100 }}
          exit={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed z-40 top-40 bottom-[-20px] right-10 left-10 lg:left-[80%] rounded-md bg-[#000] p-5 overflow-y-auto shadow-lg small-scrollbar pb-20"
        >
          <MainSettings
            setSettingsState={setSettingsState}
            setTitle={setTitle}
          />
          <AnimatePresence>
            {settingsState.page === "logout" && (
              <Logout setSettingsState={setSettingsState} setTitle={setTitle} />
            )}
          </AnimatePresence>
        </motion.nav>
      </div>
    </>
  );
};

export default UserMenu;
