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

import { Contacts } from "../types/userTypes";

// Retrieve and return the initials of a username
export const getInitials = (name: string) => {
  name = name.trim();
  const parts = name.split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase() || "Me";
  }
  return (
    parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase() || "Me"
  );
};

export const normalizePhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/\D/g, "");
};

/*
  NOTE:
    uc: Updated contact
    nc: New contact
    oc: Original contact
*/
export const contactFromFormState = (
  nc: Contacts,
  oc: Contacts | undefined
): Contacts => {
  if (oc === undefined) {
    return nc;
  }

  const uc: Contacts = {
    ...oc,
  };

  nc.name ? (uc.name = nc.name) : null;
  nc.nickname ? (uc.nickname = nc.nickname) : null;
  nc.number ? (uc.number = nc.number) : null;
  nc.avatar ? (uc.avatar = nc.avatar) : null;
  nc.email ? (uc.email = nc.email) : null;
  nc.address ? (uc.address = nc.address) : null;
  nc.website ? (uc.website = nc.website) : null;
  nc.space ? (uc.space = nc.space) : null;

  return uc;
};
