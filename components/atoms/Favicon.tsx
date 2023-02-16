import React, { useEffect } from "react";

type Props = {
  url: string;
  sz?: number;
  width?: number;
  isEffectedStyle?: boolean;
};

const Favicon = (props: Props) => {
  const { url, sz, width, isEffectedStyle } = props;

  const getSrc = () => {
    const img = sz
      ? `https://www.google.com/s2/favicons?domain=${url}&sz=${sz}`
      : `https://www.google.com/s2/favicons?domain=${url}`;

    return img;
  };

  const imgStyle = () => {
    return isEffectedStyle
      ? {
          borderRadius: "8px",
          background: "#ffffff",
        }
      : {};
  };

  return (
    <>
      <img
        className="mx-auto"
        src={getSrc()}
        id="image"
        width={width ?? "auto"}
        style={imgStyle()}
      />
    </>
  );
};

export default Favicon;
