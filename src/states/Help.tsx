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
import { MdEmail, MdPhone } from "react-icons/md";

const PaddedSection = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return <div className="px-5 md:px-20 lg:px-60">{children}</div>;
};

const ColorSection = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <div className="px-5 md:px-20 py-20 lg:px-60 bg-gradient-to-tr from-[#ff63c1] to-[#ef63ff] text-black">
      {children}
    </div>
  );
};

const Help = React.memo((): JSX.Element => {
  return (
    <section className="mt-20 text-white">
      <PaddedSection>
        <h1 className="text-2xl mb-10">Welcome To Txt Me</h1>
      </PaddedSection>
      <ColorSection>
        <div>
          <p>
            <span className="text-lg border-b border-b-black pb-2 line-clamp-1">
              This is the help me page !
            </span>{" "}
            <br /> I am sorry, you are having issues with the app. If at any
            point this documentation still is not satisfying your questions,
            please reach out immediately
          </p>
          <div className="bg-white mt-10">
            <a
              href="tel:702-981-1370"
              className="flex justify-between items-center p-5 hover:bg-[#222] hover:text-white duration-200"
            >
              <MdPhone />
              <span>1+ (702)-981-1370</span>
            </a>
            <a
              href="mailto:ryanlarge@ryanlarge.dev"
              className="flex justify-between items-center p-5 hover:bg-[#222] hover:text-white duration-200"
            >
              <MdEmail />
              <span>ryanlarge@ryanlarge.dev</span>
            </a>
          </div>
        </div>
      </ColorSection>
      <PaddedSection>
        <h2 className="text-xl font-bold text-secondary mb-5 mt-10 text-center">
          What Do You Need Help With ?
        </h2>
        <nav className="p-5">
          <ul className="flex flex-wrap gap-1 justify-center items-center">
            <li className="hover:bg-white hover:text-black duration-200">
              <a href="#login" className="px-5 py-3 block">
                Login
              </a>
            </li>
            <li className="hover:bg-white hover:text-black duration-200">
              <a href="#" className="px-5 py-3 block">
                Signing Up
              </a>
            </li>
            <li className="hover:bg-white hover:text-black duration-200">
              <a href="#" className="px-5 py-3 block">
                Verifying
              </a>
            </li>
            <li className="hover:bg-white hover:text-black duration-200">
              <a href="#" className="px-5 py-3 block">
                Profile
              </a>
            </li>
            <li className="hover:bg-white hover:text-black duration-200">
              <a href="#" className="px-5 py-3 block">
                Messages
              </a>
            </li>
            <li className="hover:bg-white hover:text-black duration-200">
              <a href="#" className="px-5 py-3 block">
                Contacts
              </a>
            </li>
            <li className="hover:bg-white hover:text-black duration-200">
              <a href="#" className="px-5 py-3 block">
                Security
              </a>
            </li>
            <li className="hover:bg-white hover:text-black duration-200">
              <a href="#" className="px-5 py-3 block">
                Settings
              </a>
            </li>
            <li className="hover:bg-white hover:text-black duration-200">
              <a href="#" className="px-5 py-3 block">
                Something Else
              </a>
            </li>
          </ul>
        </nav>
        <p className="mt-10 text-xs text-gray-300 text-center mx-10 max-w-[400px] mb-5">
          If you do not see am option that meats your needs, please call or send
          an email out and we will reach out to you immediately to answer your
          questions
        </p>
      </PaddedSection>
      <ColorSection>
        <h2 id="login" className="text-xl font-bold mb-5 text-center">
          Login
        </h2>
      </ColorSection>
    </section>
  );
});

export default Help;
