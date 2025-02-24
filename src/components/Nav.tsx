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
