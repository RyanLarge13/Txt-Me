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

import { useMemo } from "react";

const useLogger = () => {
  const loggerMode = import.meta.env.VITE_LOGGER_MODE || "prod";

  return useMemo(() => {
    const devLog = (text: string, warn: boolean = false) => {
      if (loggerMode === "dev") {
        warn
          ? console.warn(`DEV LOG: \n${text}`)
          : console.log(`DEV LOG: \n${text}`);
      }
    };

    const devLogDebug = (text: string) => {
      if (loggerMode === "dev") {
        console.debug(`DEV LOG DEBUG: \n${text}`);
      }
    };

    const logError = (text: string) => {
      console.error(`ERROR: \n${text}`);
    };

    const productionLog = (text: string) => {
      if (loggerMode === "production") {
        console.log(`PRODUCTION LOG: \n${text}`);
      }
    };

    const logAll = (text: string) => {
      console.log(`LOG: \n${text}`);
    };

    const logAllError = (text: string) => {
      console.error(`LOG ERROR: \n${text}`);
    };

    return {
      devLog,
      devLogDebug,
      logError,
      productionLog,
      logAll,
      logAllError,
    };
  }, [loggerMode]);
};

export default useLogger;
