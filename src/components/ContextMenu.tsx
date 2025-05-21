import React, { useEffect, useRef } from "react";

import useContextMenu from "../hooks/useContextMenu";
import { ContextMenuOptions } from "../types/interactiveCtxtTypes";

const BackDrop = ({
  z = 999,
  blur = false,
  callback,
}: {
  z: number;
  blur: boolean;
  callback: (e: React.MouseEvent<HTMLDivElement>) => void;
}): JSX.Element => {
  return (
    <div
      onClick={(e) => callback(e)}
      style={{ zIndex: z }}
      className={`fixed inset-0 ${
        blur ? "bg-opacity-20 backdrop-blur-sm bg-black" : "bg-transparent"
      }`}
    ></div>
  );
};

const ContextMenu = (): JSX.Element | null => {
  const contextMenu = useContextMenu();

  // Import context menu data amd provide default values if failures appear
  const coords = contextMenu.getValue("coords") || { x: 0, y: 0 };
  const options = contextMenu.getValue("options") || [];
  const mainOptions = contextMenu.getValue("mainOptions") || [];

  /*
    NOTE: 
      Use the color attribute below somewhere in the JSX at some point
  */
  // const contextMenuColor = contextMenu.getValue("color") || "#000";
  const show = contextMenu.getValue("show");

  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  const M_HideContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    contextMenu.hide();
  };

  useEffect(() => {
    M_AdjustCoords();
  }, [contextMenu]);

  /*
    DESC:
      Adjust the placement of the fixed context menu in screen space
      as to avoid clipping the context menu near the edges of a screen
  */
  const M_AdjustCoords = (): void => {
    const defaultStyles = { y: coords.y, x: coords.x };

    if (contextMenuRef.current) {
      const div = contextMenuRef.current;
      const rect = div.getBoundingClientRect();

      const w = rect.width;
      const h = rect.height;
      const winWidth = window.innerWidth;
      const winHeight = window.innerHeight;

      /*
        NOTE:
          1. Diff variables are for calculating how much of the context
          menu is clipped off the screen. Adjustment will be the amount
          clipped plus an extra 5 pixels
      */
      const leftDiff = defaultStyles.x + w - winWidth;
      console.log("Ref");
      const topDiff = defaultStyles.y + h - winHeight;
      if (leftDiff >= 0) {
        defaultStyles.x -= leftDiff + 5;
      }
      if (defaultStyles.x <= 0) {
        defaultStyles.x += Math.abs(defaultStyles.x) + 5;
      }
      if (topDiff >= 0) {
        defaultStyles.y -= topDiff + 5;
      }
      if (defaultStyles.y <= 0) {
        defaultStyles.y += Math.abs(defaultStyles.y) + 5;
      }
    }

    contextMenu.setCoords(defaultStyles);
  };

  return show ? (
    <>
      <BackDrop z={998} blur={false} callback={(e) => M_HideContextMenu(e)} />
      <div
        ref={contextMenuRef}
        className="fixed bg-[#111] bg-opacity-60 backdrop-blur-md rounded-md shadow-sm z-[999] overflow-hidden"
        style={{ top: coords.y, left: coords.x }}
      >
        <div className="flex justify-between items-center mb-5 rounded-md">
          {mainOptions.map((op: ContextMenuOptions, i: number) => (
            <button
              key={i}
              onClick={() => op.func()}
              className={`flex min-w-14 justify-center hover:bg-tri hover:text-black items-center flex-col gap-y-1 flex-1 w-full aspect-square duration-200 p-2 text-xs border-1 border-gray-400`}
            >
              <p className="truncate max-w-[90%]">{op.txt}</p>
              <p>{op.icon}</p>
            </button>
          ))}
        </div>
        {options.map((op: ContextMenuOptions, i: number) => (
          <button
            key={i}
            className="flex justify-between items-center px-5 py-3 hover:bg-primary hover:text-black duration-200 w-full p-2 text-sm"
            onClick={() => op.func()}
          >
            <p className="truncate">{op.txt}</p>
            <p>{op.icon}</p>
          </button>
        ))}
      </div>
    </>
  ) : null;
};

export default ContextMenu;
