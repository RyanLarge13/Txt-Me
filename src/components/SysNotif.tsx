import React, { useContext, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserContext from "../context/userCtxt";

const SysNotif = (): JSX.Element => {
  const { sysNotif, setSysNotif } = useContext(UserContext);

  const notifTimeoutRef = useRef(null || 0);

  const handleDrag = (e): void => {
    const end = e.clientX;
    const minDistance = window.innerWidth / 1.4;
    if (end > minDistance) {
      setSysNotif({
        show: false,
        title: "",
        text: "",
        color: "",
        hasCancel: false,
        actions: [],
      });
    }
  };

  useEffect(() => {
    if (sysNotif.show === true && sysNotif.hasCancel === false) {
      notifTimeoutRef.current = setTimeout(() => {
        setSysNotif({
          show: false,
          title: "",
          text: "",
          color: "",
          hasCancel: false,
          actions: [],
        });
      }, 5000);
    } else {
      clearTimeout(notifTimeoutRef.current);
    }
    return () => {
      clearTimeout(notifTimeoutRef.current);
    };
  }, [sysNotif, setSysNotif]);

  return (
    <AnimatePresence>
      {sysNotif.show && (
        <>
          <motion.div
            drag="x"
            dragSnapToOrigin={true}
            onDragEnd={handleDrag}
            initial={{ y: -50, opacity: 0 }}
            exit={{ x: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`fixed top-10 z-40 p-3 pl-5 pb-0 rounded-sm shadow-lg w-[90vw] text-[#fff] bg-[#0a0a0a] left-[5vw] max-w-[400px]`}
            onPointerDown={() =>
              !sysNotif.hasCancel
                ? setSysNotif({ ...sysNotif, hasCancel: true })
                : null
            }
          >
            {!sysNotif.hasCancel && (
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: "100%",
                  transition: { duration: 5 },
                }}
                className={`absolute top-0 left-0 min-h-[4px] ${sysNotif.color} rounded-l-full`}
              ></motion.div>
            )}
            <div
              className={`absolute top-0 left-0 bottom-0 ${sysNotif.color} w-[5px] rounded-md`}
            ></div>
            <p className="text-lg font-semibold">{sysNotif.title}</p>
            <p className="text-xs whitespace-pre-line">{sysNotif.text}</p>
            <div className="mt-3 p-1 border-t flex justify-between items-center">
              {sysNotif.actions?.map((action, index: number) => (
                <button
                  key={index}
                  onClick={() => action.func()}
                  className="cursor-pointer hover:text-slate-300 duration-200 text-sm font-semibold"
                >
                  {action.text}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SysNotif;
