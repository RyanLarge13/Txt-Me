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

import React from "react";
import { Outlet } from "react-router-dom";

import BottomNav from "../components/BottomNav.tsx";
import MessageSession from "../components/MessageSession.tsx";
import ProfileNav from "../components/ProfileNav.tsx";

const Profile = (): JSX.Element => {
  return (
    <main className="mt-20 text-[#fff]">
      <ProfileNav />
      <div className="flex justify-center items-center absolute inset-0 outline outline-red-300">
        <MessageSession />
      </div>
      <BottomNav />
      <Outlet />
    </main>
  );
};

export default Profile;
