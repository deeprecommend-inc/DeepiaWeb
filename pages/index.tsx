import React, { useEffect } from "react";
import { Box } from "@mui/system";
import router, { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setLogList } from "../redux/reducers/logSlice";
import {
  setCurrentUser,
  updateIsAfterLogin,
} from "../redux/reducers/authSlice";
import { NextSeo } from "next-seo";
import ResponsiveDrawer from "../components/template/ResponsiveDrawer";
import { logUiController } from "../libs/log/presentation/log.ui.controler";
import { authUiController } from "../libs/auth/presentation/auth.ui.controller";
import { categoryUiController } from "../libs/category/presentation/category.ui.controller";
import {
  setCategoryList,
  setPublicCategoryList,
} from "../redux/reducers/categorySlice";
import { useSession, signIn, signOut } from "next-auth/react";
import { asyncLocalStorage } from "../general/utils/asyncLocalStorage";
import {
  accessTokenKey,
  categoryIdForGetLogKey,
  darkModeKey,
} from "../general/constants/localStorageKey";
import { pink } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { categoryLogUiController } from "../libs/category_log/presentation/category_log.ui.controller";
import { setDark } from "../redux/reducers/uiSlice";
import { useLocale } from "../hooks/useLocale";

const darkMode = createTheme({
  palette: {
    primary: {
      main: pink[500],
    },
    mode: "dark",
  },
});

const lightMode = createTheme({});

const Home = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAfterLogin = useAppSelector((state) => state.auth.isAfterLogin);
  const dark = useAppSelector((state) => state.ui.dark);
  const { t, locale } = useLocale();

  useEffect(() => {
    const init = async () => {
      const token = await asyncLocalStorage.getItem(accessTokenKey);
      const dark = await asyncLocalStorage.getItem(darkModeKey);

      if (!token) {
        // await asyncLocalStorage.removeItem(accessTokenKey);
        // router.push("login");
        // return;
      } else {
        dispatch(updateIsAfterLogin(true));
      }

      if (!isAfterLogin) {
        await authUiController.currentUser().then((currentUser) => {
          dispatch(setCurrentUser(currentUser));
        });
        //   .catch(() => {
        //     router.push("login");
        //   });

        // const categoryId = await asyncLocalStorage.getItem(
        //   categoryIdForGetLogKey
        // );

        // const logList = categoryId
        //   ? await categoryLogUiController.findAll(Number(categoryId))
        //   : await logUiController.findAll();
        // const categoryList = await categoryUiController.findAll();
        // const publicCategoryList = await categoryUiController.findPublic();

        // dispatch(setLogList(logList));

        // dispatch(setCategoryList(categoryList));
        // dispatch(setPublicCategoryList(publicCategoryList));
      }

      Boolean(dark)
        ? await dispatch(setDark(true))
        : await dispatch(setDark(false));
    };

    init();
  }, []);

  return (
    <>
      <NextSeo
        title={t.index.head.title}
        description={t.index.head.description}
        canonical={"https://deepia.net"}
        openGraph={{
          url: "https://deepia.net",
          title: t.index.head.title,
          description: t.index.head.description,
          type: "website",
          locale: locale,
          images: [
            {
              url: "https://deepia.s3.ap-northeast-1.amazonaws.com/DeepRecommend+(1).png",
              width: 800,
              height: 600,
              alt: "DeepRecommend",
              type: "image/png",
            },
            {
              url: "https://deepia.s3.ap-northeast-1.amazonaws.com/DeepRecommend+(1).png",
              width: 900,
              height: 800,
              alt: "DeepRecommend",
              type: "image/png",
            },
            {
              url: "https://deepia.s3.ap-northeast-1.amazonaws.com/DeepRecommend+(1).png",
            },
          ],
          site_name: "DeepRecommend",
        }}
        twitter={{
          handle: "@DeepRecommend",
          site: "@DeepRecommend",
          cardType: "summary",
        }}
      />
      <ThemeProvider theme={dark ? darkMode : lightMode}>
        <Box
          className={`h-screen overflow-scroll ${dark ? "dark" : "light"}`}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
        >
          <ResponsiveDrawer contents={<></>} />
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Home;
