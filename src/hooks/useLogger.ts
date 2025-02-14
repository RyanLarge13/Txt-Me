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
    const devLog = (...args: any[]) => {
      if (loggerMode === "dev") {
        console.log.apply(console, ["DEV LOG:", ...args]);
      }
    };

    const devLogDebug = (...args: any[]) => {
      if (loggerMode === "dev") {
        console.debug.apply(console, ["DEV LOG DEBUG:", ...args]);
      }
    };

    const logError = (...args: any[]) => {
      console.error.apply(console, ["ERROR:", ...args]);
    };

    const productionLog = (...args: any[]) => {
      if (loggerMode === "production") {
        console.log.apply(console, ["PRODUCTION LOG:", ...args]);
      }
    };

    const logAll = (...args: any[]) => {
      console.log.apply(console, ["LOG:", ...args]);
    };

    const logAllError = (...args: any[]) => {
      console.error.apply(console, ["LOG ERROR:", ...args]);
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
