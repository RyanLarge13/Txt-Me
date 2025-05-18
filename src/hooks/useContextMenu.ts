import { useCallback, useContext } from "react";

import InteractiveCtxt from "../context/interactiveCtxt";
import { ContextMenuOption } from "../types/generalTypes";
import { ContextMenuShowType } from "../types/interactiveCtxtTypes";

/*
  TODO:
    NOTE:
      Context Menu Type...

      {
        show: boolean;
        color: string;
        coords: { x: number; y: number };
        mainOptions: {
            txt: string;
            func: () => void;
        }[];
        options: {
            txt: string;
            func: () => void;
        }[];
      };
*/

const useContextMenu = () => {
  const { contextMenuShow, setContextMenuShow } = useContext(InteractiveCtxt);

  // Setters
  const buildContextMenu = useCallback(
    (contextMenuOptions: ContextMenuShowType) => {
      setContextMenuShow(contextMenuOptions);
    },
    [contextMenuShow]
  );

  const makeVisible = useCallback(() => {
    setContextMenuShow((prev) => {
      return { ...prev, show: true };
    });
  }, [contextMenuShow]);

  const setMainOptions = useCallback(
    (mainOptions: ContextMenuOption[]) => {
      if (mainOptions.length < 1) {
        throw new Error(
          "You must at least pass one option into setMainOption method"
        );
      }
      setContextMenuShow((prev) => {
        return { ...prev, mainOptions: mainOptions };
      });
    },
    [contextMenuShow]
  );

  const setOptions = useCallback(
    (options: ContextMenuOption[]) => {
      if (options.length < 1) {
        throw new Error(
          "You must at least pass one option into setMainOption method"
        );
      }
      setContextMenuShow((prev) => {
        return { ...prev, options: options };
      });
    },
    [contextMenuShow]
  );

  const setCoords = useCallback(
    (newCoords: { x: number; y: number }) => {
      if (!newCoords.x || !newCoords.y) {
        throw new Error(
          "Please pass in both an x and y coordinate to update the position of the context menu"
        );
      }

      setContextMenuShow((prev) => {
        return { ...prev, coords: newCoords };
      });
    },
    [contextMenuShow]
  );

  const setColor = useCallback(
    (newColor: string) => {
      if (!newColor) {
        throw new Error(
          "Please pass in a valid color string to update the color of the context menu"
        );
      }

      setContextMenuShow((prev) => {
        return { ...prev, color: newColor };
      });
    },
    [contextMenuShow]
  );

  const setTitle = useCallback(
    (newTitle: string) => {
      if (!newTitle) {
        throw new Error(
          "Please pass in a valid color string to update the color of the context menu"
        );
      }

      setContextMenuShow((prev) => {
        return { ...prev, title: newTitle };
      });
    },
    [contextMenuShow]
  );

  // Getters
  const getValue = useCallback(
    <T extends keyof ContextMenuShowType>(key: T) => {
      const value = contextMenuShow[key];
      return value;
    },
    [contextMenuShow]
  );

  return {
    // Setters
    buildContextMenu,
    makeVisible,
    setMainOptions,
    setOptions,
    setCoords,
    setColor,
    setTitle,

    // Getters
    getValue,
  };
};

export default useContextMenu;
