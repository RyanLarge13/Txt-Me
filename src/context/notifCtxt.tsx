/*
Txt Me - A learn to draw program
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

import { AxiosError } from "axios";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import useLogger from "../hooks/useLogger.ts";
import {
  Actions,
  NotifActionProps,
  NotifStateProps,
  SysNotifType,
} from "../types/notifTypes.ts";

const NotifStateCtxt = createContext({} as NotifStateProps);
const NotifActionsCtxt = createContext({} as NotifActionProps);

export const NotifProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [notifs, setNotifs] = useState<SysNotifType[]>([]);
  const [storedNotifs, setStoredNotifs] = useState<SysNotifType[]>([]);

  const log = useLogger();

  const addSuccessNotif = useCallback(
    (
      title: string,
      text: string,
      hasCancel: boolean,
      actions: Actions[]
    ): void => {
      const id = uuidv4();
      const newNotif = {
        id: id,
        confirmation: false,
        title: title,
        text: text,
        color: "bg-primary",
        hasCancel: hasCancel,
        time: new Date(),
        actions: [{ text: "close", func: () => removeNotif(id) }, ...actions],
      };
      setNotifs((prev) => {
        return [...prev, newNotif];
      });
    },
    []
  );

  const addErrorNotif = useCallback(
    (
      title: string,
      text: string,
      hasCancel: boolean,
      actions: Actions[]
    ): void => {
      const id = uuidv4();
      const newNotif = {
        id: id,
        confirmation: false,
        title: title,
        text: text,
        color: "bg-secondary",
        hasCancel: hasCancel,
        time: new Date(),
        actions: [{ text: "close", func: () => removeNotif(id) }, ...actions],
      };
      setNotifs((prev) => {
        return [...prev, newNotif];
      });
    },
    []
  );

  const showNetworkErrorNotif = useCallback((actions: Actions[]): void => {
    const id = uuidv4();
    const newNotif = {
      id: id,
      confirmation: false,
      title: "Network Error",
      text: "Please check your internet connection",
      color: "bg-secondary",
      hasCancel: false,
      time: new Date(),
      actions: [{ text: "close", func: () => removeNotif(id) }, ...actions],
    };
    setNotifs((prev) => {
      return [...prev, newNotif];
    });
  }, []);

  const removeNotif = useCallback((id: string): void => {
    setNotifs((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const clearAllNotifs = useCallback((): void => {
    setNotifs([]);
  }, []);

  const handleAPIErrorNotif = useCallback((err: AxiosError): void => {
    const code = err.code;
    const message = err.message;
    const response = err.response;
    const request = err.request;

    log.devLog(err);

    // if (!err.code || !err.message) {
    //   throw new TypeError(
    //     "You must pass AxiosError type into handleAPIErrorNotif function. You are missing 'code' or 'message' in error object"
    //   );
    // }

    if (
      code === "ECONNABORTED" ||
      code === "ETIMEDOUT" ||
      message === "Network Error" ||
      code === "EHOSTUNREACH" ||
      code === "ENOTFOUND" ||
      code === "ECONNREFUSED" ||
      (request && !response)
    ) {
      log.devLog("Possible network issues", err);
      showNetworkErrorNotif([]);
      return;
    }
    if (code === "ENOTFOUND") {
      log.logAllError(
        "There was an error with your request and must be resolved immediately",
        err
      );
      throw new Error("Check the url, the server address could not be found");
    }
    if (code === "ECONNREFUSED") {
      log.logAllError(
        "There was a problem reaching the server. Server possibly down or network issues have appeared. Resolve immediately",
        err
      );
      throw new Error("Problem reaching server ECONNREFUSED");
    }

    if (response) {
      const status = response.status;
      const serverResponse = response.data as {
        message: string | null;
      } | null;

      switch (status) {
        case 400: {
          const message =
            serverResponse?.message ||
            "Please check your request and try again. It seems something went wrong on your end";
          addErrorNotif("Bad Request", message, true, []);
          return;
        }
        case 401: {
          const message =
            serverResponse?.message ||
            "You are not authorized to make this request. Please sign in again";
          addErrorNotif("Login", message, true, []);
          return;
        }
        case 500: {
          log.logAllError(
            "Server error",
            err,
            "There was an error on the server when the user made this request"
          );
          addErrorNotif(
            "Application Error",
            "We are so sorry for this inconvenience. This error message should not be happening. Please contact the developer at your earliest convenience",
            true,
            []
          );
          return;
        }
        default: {
          addErrorNotif(
            "Error",
            "Something went wrong. We are terribly sorry. Please try again and if the issue persists, contact the developer",
            true,
            []
          );
          return;
        }
      }
    }

    addErrorNotif(
      "Error",
      "Something went wrong. We are terribly sorry. Please try again and if the issue persists, contact the developer",
      true,
      []
    );
  }, []);

  return (
    <NotifStateCtxt.Provider
      value={{
        notifs,
        storedNotifs,
      }}
    >
      <NotifActionsCtxt.Provider
        value={{
          addSuccessNotif,
          addErrorNotif,
          removeNotif,
          showNetworkErrorNotif,
          clearAllNotifs,
          setStoredNotifs,
          handleAPIErrorNotif,
        }}
      >
        {children}
      </NotifActionsCtxt.Provider>
    </NotifStateCtxt.Provider>
  );
};

export const useNotifState = () => {
  const context = useContext(NotifStateCtxt);
  if (!context)
    throw new Error("useNotifState must be used within a NotifProvider");
  return context;
};

export const useNotifActions = () => {
  const context = useContext(NotifActionsCtxt);
  if (!context)
    throw new Error("useNotifActions must be used within a NotifProvider");
  return context;
};
