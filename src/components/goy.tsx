"use client";

import React, { MouseEvent } from "react";

const Goy = ({
  id,
  children,
  className,
  key
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  key?: string
}) => {
//   console.log(scrollMargin);

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>, myelement: string) => {
    const newScrollMargin = 60;
    console.log(e);

    const element = document.getElementById(myelement);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - newScrollMargin,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
    key={key}
      aria-label="Go Button"
      className={className}
      onClick={(e) => handleButtonClick(e, `${id}`)}
    >
      {children}
    </button>
  );
};

export default Goy;
