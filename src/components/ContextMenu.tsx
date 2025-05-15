import React from "react";

import { ContextMenuOption } from "../types/generalTypes";

const ContextMenu = ({
  coords,
  options,
}: {
  coords: { x: number; y: number };
  options: ContextMenuOption[];
}): JSX.Element => {
  const handleOpClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    func: () => void
  ): void => {
    e.preventDefault();
    func();
  };

  return (
    <div
      className="fixed bg-black rounded-md shadow-md z-[999]"
      style={{ top: coords.y, left: coords.x }}
    >
      {options.map((op, index) => (
        <button
          key={index}
          className="flex justify-between items-center px-5 py-2 hover:bg-[#222] duration-200"
          onClick={(e) => handleOpClick(e, op.func)}
        >
          {op.txt}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;
