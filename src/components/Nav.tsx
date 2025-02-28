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
import { SiHomeadvisor } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const Nav = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <header
      className="fixed top-0 right-0 left-0 rounded-b-md shadow-lg p-3
  bg-[#000] z-40"
    >
      <button onClick={() => navigate("/")}>
        <SiHomeadvisor className="text-[#fff] text-xl" />
      </button>
    </header>
  );
};

export default Nav;
