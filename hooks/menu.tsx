import Router from "next/router";
import { accessTokenKey } from "../general/constants/localStorageKey";
import { asyncLocalStorage } from "../general/utils/asyncLocalStorage";
import { useLocale } from "./useLocale";
import GroupIcon from "@mui/icons-material/Group";
import StoreIcon from "@mui/icons-material/Store";
import HomeIcon from "@mui/icons-material/Home";
import FeedbackIcon from "@mui/icons-material/Feedback";
import React from "react";

export const useMenus = () => {
  const { t } = useLocale();
  const menus = [
    {
      title: t.leftNav.homepage,
      link: "/",
      iconElement: <HomeIcon />,
    },
    {
      title: t.leftNav.following,
      link: "/following",
      iconElement: <GroupIcon />,
    },
  ];

  return menus;
};
