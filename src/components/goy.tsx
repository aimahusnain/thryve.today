"use client";

import React, { useState } from "react";

const Goy = ({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const [scrollMargin, setScrollMargin] = useState(0);
  console.log(scrollMargin);

  const handleButtonClick = (e: any, myelement: string) => {
    const newScrollMargin = 60;
    setScrollMargin(newScrollMargin);
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
      aria-label="Go Button"
      className={className}
      onClick={(e) => handleButtonClick(e, `${id}`)}
    >
      {children}
    </button>
  );
};

export default Goy;
