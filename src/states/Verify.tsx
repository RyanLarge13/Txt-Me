import React from "react";
import { useParams } from "react-router-dom";

import EmailVerify from "./EmailVerify";
import PhoneVerify from "./PhoneVerify";

const Verify = React.memo((): JSX.Element => {
  const { type } = useParams();

  return (
    <main
      className="text-[#fff] flex flex-col justify-center items-center
  h-screen gap-y-5 px-10 lg:px-80"
    >
      {type === "phone" ? <PhoneVerify /> : <EmailVerify />}
    </main>
  );
});

export default Verify;
