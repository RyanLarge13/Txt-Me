import React, { useEffect, useState } from "react";

import useContextMenu from "../hooks/useContextMenu";
import { ContextMenuOptions } from "../types/interactiveCtxtTypes";

const BackDrop = ({
  z = 999,
  blur = false,
}: {
  z: number;
  blur: boolean;
  click: () => void;
}): JSX.Element => {
  return (
    <div
      className={`z-[${z}] fixed inset-0 ${
        blur ? "bg-opacity-20 backdrop-blur-sm bg-black" : "bg-transparent"
      }`}
    ></div>
  );
};

const ContextMenu = (): JSX.Element | null => {
  const contextMenu = useContextMenu();

  const [show, setShow] = useState(contextMenu.getValue("show") || false);
  const coords = contextMenu.getValue("coords");
  const options = contextMenu.getValue("options");
  const mainOptions = contextMenu.getValue("mainOptions");
  /*
    TODO:
      IMPLEMENT:
        1. Pull in color with contextMenu.getValue("color"); To use it  somewhere in the component
  */

  useEffect(() => {
    const newShow = contextMenu.getValue("show");
    setShow(newShow);
  }, [contextMenu]);

  return show ? (
    <>
      <BackDrop z={998} blur={false} click={() => contextMenu.hide()} />
      <div
        className="fixed bg-black rounded-md shadow-md z-[999] overflow-hidden shadow-tri"
        style={{ top: coords.y, left: coords.x }}
      >
        <div className="flex justify-between items-center">
          {mainOptions.map((op: ContextMenuOptions, i: number) => (
            <button
              key={i}
              onClick={() => op.func()}
              className="flex justify-center items-center flex-col gap-y-1 flex-1 w-full aspect-square"
            >
              {op.txt} {op.icon}
            </button>
          ))}
        </div>
        {options.map((op: ContextMenuOptions, i: number) => (
          <button
            key={i}
            className="flex justify-between items-center px-5 py-2 hover:bg-[#222] duration-200 border-b"
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
