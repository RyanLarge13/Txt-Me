import React from "react";
import { useNavigate } from "react-router-dom";
import { BsFillMenuButtonWideFill } from "react-icons/bs";

const ProfileNav = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <header
      className="fixed top-0 right-0 left-0 rounded-b-md shadow-lg p-3
  bg-[#000] z-40"
    >
      <button onClick={() => navigate("/")}>
        <BsFillMenuButtonWideFill className="text-primary text-xl" />
      </button>
    </header>
  );
};

export default ProfileNav;
