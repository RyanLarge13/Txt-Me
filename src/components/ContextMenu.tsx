import React, { useEffect, useRef, useState } from "react";

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
      onClick={callback}
      className={`z-[${z}] fixed inset-0 ${
        blur ? "bg-opacity-20 backdrop-blur-sm bg-black" : "bg-transparent"
      }`}
    ></div>
  );
};

const ContextMenu = (): JSX.Element | null => {
  const contextMenu = useContextMenu();

  // Import context menu data amd provide default values if failures appear
  const [show, setShow] = useState(contextMenu.getValue("show") || false);
  const coords = contextMenu.getValue("coords") || { x: 0, y: 0 };
  const options = contextMenu.getValue("options") || [];
  const mainOptions = contextMenu.getValue("mainOptions") || [];
  const contextMenuColor = contextMenu.getValue("color") || "#000";

  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const newShow = contextMenu.getValue("show");
    setShow(newShow);
  }, [contextMenu]);

  /*
    TODO:
      IMPLEMENT:
        1. Correct this so you can remove this useEffect 
        above and update the hide context menu member component method. 
        I should be able to have this state update by other 
        method and construction
        from other triggers
  */
  const M_HideContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShow(false);
    contextMenu.hide();
  };

  /*
    DESC:
      Adjust the placement of the fixed context menu in screen space
      as to avoid clipping the context menu near the edges of a screen
  */
  const M_AdjustCoords = (): { top: number; left: number } => {
    const defaultStyles = { top: coords.y, left: coords.x };

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
      const leftDiff = defaultStyles.left + w - winWidth;
      const topDiff = defaultStyles.top + h - winHeight;
      if (leftDiff > 0) {
        defaultStyles.left -= leftDiff + 5;
      }
      if (defaultStyles.left < 0) {
        defaultStyles.left += Math.abs(defaultStyles.left) + 5;
      }
      if (topDiff > 0) {
        defaultStyles.top -= topDiff + 5;
      }
      if (defaultStyles.top < 0) {
        defaultStyles.top += Math.abs(defaultStyles.top) + 5;
      }
    }

    return defaultStyles;
  };

  return show ? (
    <>
      <BackDrop z={998} blur={false} callback={M_HideContextMenu} />
      <div
        ref={contextMenuRef}
        className="fixed bg-black rounded-md shadow-md z-[999] overflow-hidden"
        style={
          /*
            NOTE:
              1. Returns only top and left style values.
              Must use spread operator or rebuild to include other custom styles
          */
          M_AdjustCoords()
        }
      >
        <div
          className={`absolute top-0 right-0 left-0 h-1 bg-opacity-25 backdrop-blur-sm bg-[${contextMenuColor}]`}
        ></div>
        <div className="flex justify-between items-center border-b border-b-1 border-b-gray-400">
          {mainOptions.map((op: ContextMenuOptions, i: number) => (
            <button
              key={i}
              onClick={() => op.func()}
              className={`flex justify-center items-center flex-col gap-y-1 flex-1 w-full aspect-square p-2 text-xs border-1 border-gray-400`}
            >
              {op.txt} {op.icon}
            </button>
          ))}
        </div>
        {options.map((op: ContextMenuOptions, i: number) => (
          <button
            key={i}
            className="flex justify-between items-center px-5 py-2 hover:bg-[#222] duration-200 border-b w-full p-2"
            onClick={() => op.func()}
          >
            {op.txt}
          </button>
        ))}
      </div>
    </>
  ) : null;
};

export default ContextMenu;
