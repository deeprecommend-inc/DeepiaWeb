import React from "react";
import CopyrightLink from "../atoms/CopyrightLink";
import CopyrightText from "../atoms/Copyright";
import FullYear from "../atoms/FullYear";

interface Props {
  className?: string;
}

export const CopyrightContent = (props: Props) => {
  return (
    <div className={props?.className}>
      <CopyrightText />
      <FullYear />
      <CopyrightLink />
    </div>
  );
};
