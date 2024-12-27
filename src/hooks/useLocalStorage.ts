import { useState, useEffect, useCallback } from "react";

// Hook types ----------------------------------------
export type LocalStorageHookReturn<T> = [
  T | null,
  { didFail: boolean; message: string },
  (value: T) => void
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
        console.error(
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
      console.error(`Error retrieving form Local Storage ${err}`);
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
        console.error(
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

  return [storageValue, failed, setValueInStorage];
};

export default useLocalStorage;
