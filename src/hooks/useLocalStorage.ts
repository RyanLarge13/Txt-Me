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

import { useCallback, useEffect, useState } from "react";

import useLogger from "./useLogger";

// Hook types ----------------------------------------
export type LocalStorageHookReturn<T> = [
  T | null,
  (value: T) => void,
  { didFail: boolean; message: string }
];
// Hook types ----------------------------------------

const useLocalStorage = <T>(item: string): LocalStorageHookReturn<T> => {
  // Hook state ------------------------------------------------
  const [failed, setFailed] = useState<{ didFail: boolean; message: string }>({
    didFail: false,
    message: "",
  });
  const [storageValue, setStorageValue] = useState<T | null>(null);
  // Hook state ------------------------------------------------

  // Static Variable -------------------------------------------
  const log = useLogger();
  const errMessage =
    "There were problems loading your data. Please double check your permissions, and contact Txt Me immediately";
  // Static Variable -------------------------------------------

  // useEffect init --------------------------------------------
  useEffect(() => {
    setStorageValue(getValueFromStorage());
  }, [item]);
  // useEffect init --------------------------------------------

  // Local scope hook methods ----------------------------------
  const parseValue = useCallback(
    (value: string): T | null => {
      try {
        const parsedValue = JSON.parse(value);
        if (parsedValue === "null") {
          return null as T;
        }
        return parsedValue;
      } catch (err) {
        log.logAllError(
          `Error parsing local storage return value from ${item}. Error: ${err}`
        );
        setFailed({
          didFail: true,
          message: errMessage,
        });
        return value as T;
      }
    },
    [setFailed]
  );

  const getValueFromStorage = useCallback((): T | null => {
    try {
      const rawValue = localStorage.getItem(item);
      if (rawValue === null) {
        setFailed({
          didFail: true,
          message: errMessage,
        });
        return null as T;
      }
      return parseValue(rawValue);
    } catch (err) {
      log.logAllError(`Error retrieving form Local Storage ${err}`);
      setFailed({
        didFail: true,
        message: errMessage,
      });
      return null;
    }
  }, [parseValue, setFailed]);

  const setValueInStorage = useCallback(
    (value: T): void => {
      try {
        const stringValue = JSON.stringify(value);
        localStorage.setItem(item, stringValue);
        setStorageValue(value);
      } catch (err) {
        log.logAllError(
          `Error setting local storage value for ${item}. Error: ${err}`
        );
        setFailed({
          didFail: true,
          message: errMessage,
        });
      }
    },
    [setStorageValue, setFailed]
  );
  // Local scope hook methods ----------------------------------

  return [storageValue, setValueInStorage, failed];
};

export default useLocalStorage;
