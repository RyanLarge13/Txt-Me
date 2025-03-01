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

import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { ConfigContext } from "../context/configContext";
import { AppData } from "../types/configCtxtTypes";

const useAppData = <K extends keyof AppData>(
  key: K
): [AppData[K], Dispatch<SetStateAction<AppData>>] => {
  const { getAppData, setAppData } = useContext(ConfigContext);
  const [value, setValue] = useState<AppData[K]>(() => getAppData(key));

  useEffect(() => {
    setValue(getAppData(key));
  }, [getAppData(key)]);

  return [value, setAppData];
};

export default useAppData;
