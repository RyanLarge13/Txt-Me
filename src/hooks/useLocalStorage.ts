import { useState, useEffect, useCallback } from "react";

export type LocalStorageHookReturn<T> = [
  T | null,
  { didFail: boolean; message: string },
  (value: T) => void
];

const useLocalStorage = <T>(item: string): LocalStorageHookReturn<T> => {
  const [failed, setFailed] = useState<{ didFail: boolean; message: string }>({
    didFail: false,
    message: "",
  });
  const [storageValue, setStorageValue] = useState<T | null>(null);

  const errMessage =
    "There were problems loading your data. Please double check your permissions, and contact Txt Me immediately";

  const parseValue = useCallback(
    (value: string): T | null => {
      try {
        const parsedValue = JSON.parse(value);
        if (parsedValue === null) {
          throw new Error(
            `Could not parse raw value (${item}) from localStorage`
          );
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
        return null;
      }
    },
    [setFailed]
  );

  const getValueFromStorage = useCallback((): T | null => {
    try {
      const rawValue = localStorage.getItem(item);
      if (rawValue === null) {
        throw new Error(
          `No value in local storage exists with this name. Name: ${item}`
        );
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

  useEffect(() => {
    setStorageValue(getValueFromStorage());
  }, [item]);

  return [storageValue, failed, setValueInStorage];
};

export default useLocalStorage;
