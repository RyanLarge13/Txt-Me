import React, { useContext } from "react";
import UserCtxt from "../context/userCtxt.tsx";
import ProfileNav from "../components/ProfileNav.tsx";

const Profile = (): JSX.Element => {
 const { user } = useContext(userCtxt);

 return (
  <main className="mt-20 text-[#fff]">
   <ProfileNav />
   <p className="text-[#fff] text-xl">Welcome {user.username}</p>
  </main>
 );
};

export default Profile;
