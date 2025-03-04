/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useOutsideClick } from "@/hooks/use-outside-click";
import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";

const ModalContext = createContext({
  openName: "",
  open: (name: string) => {},
  close: () => {},
});

function Modal({ children }: { children: React.ReactNode }) {
  const [openName, setOpenName] = useState<string>("");

  const close = () => setOpenName("");

  const open = (name: string) => setOpenName(name);

  return (
    <ModalContext.Provider value={{ open, close, openName }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({
  children,
  opens: openWindowName,
}: {
  children: React.ReactNode;
  opens: string;
}) {
  const { open } = useContext(ModalContext);

  return cloneElement(children as React.ReactElement, {
    onClick: () => open(openWindowName),
  });
}

function Window({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) {
  const { close, openName } = useContext(ModalContext);

  const ref = useOutsideClick(close, true);

  if (name !== openName) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="w-full max-w-lg md:max-w-3xl lg:max-w-4xl p-4 rounded-sm shadow-lg relative transition-all duration-500"
        ref={ref as React.RefObject<HTMLDivElement>}
      >
        <button
          onClick={close}
          className="absolute top-[1.9rem] right-[3rem] p-2 rounded-sm translate-x-3 transition-all duration-200 hover:bg-grey-100"
        >
          <HiXMark />
        </button>
        <div>
          {cloneElement(children as React.ReactElement, {
            onCloseModal: close,
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
