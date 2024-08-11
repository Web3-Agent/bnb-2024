import React from "react";
import Image from "next/image";

import separatorTop from "../public/images/separator/separator-top.svg";
import separatorBottom from "../public/images/separator/separator-bottom.svg";

const Separator = ({ top }) => {
  return (
    <>
      {top ? (
        <div className="chatenai-separator">
          <Image className="w-100" src={separatorTop} alt="" />
        </div>
      ) : (
        <div className="chatenai-separator">
          <Image className="w-100" src={separatorBottom} alt="" />
        </div>
      )}
    </>
  );
};

export default Separator;
