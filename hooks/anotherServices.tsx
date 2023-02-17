import Router from "next/router";
import { accessTokenKey } from "../general/constants/localStorageKey";
import { asyncLocalStorage } from "../general/utils/asyncLocalStorage";
import { useLocale } from "./useLocale";
import GroupIcon from "@mui/icons-material/Group";
import StoreIcon from "@mui/icons-material/Store";
import HomeIcon from "@mui/icons-material/Home";
import FeedbackIcon from "@mui/icons-material/Feedback";
import React from "react";

export const useAnotherServices = () => {
  const { t } = useLocale();
  const anotherServices = [
    {
      title: t.leftNav.homepage,
      link: "https://www.deep-recommend.com/deepia",
      iconElement: <HomeIcon />,
    },
    {
      title: t.leftNav.community,
      link: "https://discord.gg/QjSFUCzDn5",
      iconElement: <GroupIcon />,
    },
    {
      title: t.leftNav.feedback,
      link: "https://www.deep-recommend.com/feedback",
      iconElement: <FeedbackIcon />,
    },
    {
      title: t.leftNav.shop,
      link: "https://deeprecommed.official.ec",
      iconElement: <StoreIcon />,
    },
  ];

  return anotherServices;
};
