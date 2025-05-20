import React, { useEffect, useState } from "react";

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
  /*
    TODO:
      IMPLEMENT:
        1. Pull in color with contextMenu.getValue("color"); To use it  somewhere in the component
  */

  useEffect(() => {
    const newShow = contextMenu.getValue("show");
    setShow(newShow);
  }, [contextMenu]);

  const M_HideContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    contextMenu.hide();
  };

  return show ? (
    <>
      <BackDrop z={998} blur={false} callback={M_HideContextMenu} />
      <div
        className="fixed bg-black rounded-md shadow-md z-[999] overflow-hidden shadow-tri"
        style={{ top: coords.y, left: coords.x }}
      >
        <div
          className={`absolute top-0 right-0 left-0 h-1 bg-opacity-25 backdrop-blur-sm bg-[${contextMenuColor}]`}
        ></div>
        <div className="flex justify-between items-center">
          {mainOptions.map((op: ContextMenuOptions, i: number) => (
            <button
              key={i}
              onClick={() => op.func()}
              className="flex justify-center items-center flex-col gap-y-1 flex-1 w-full aspect-square p-2 text-xs"
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
