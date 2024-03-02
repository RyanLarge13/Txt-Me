import { createContext, useState, useEffect, ReactNode } from "react";

const UserContext = createContext({});

export const UserProvider = ({
 children
}: {
 children: ReactNode;
}): JSX.Element => {
 return <UserContext.Provider value={{}}>{children}</UserContext.Provider>;
};

export default UserContext;
