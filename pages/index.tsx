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
import { Avatar, Chip, Grid, Toolbar } from "@mui/material";

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
        await authUiController.currentUser().then((currentUser) => {
          dispatch(setCurrentUser(currentUser));
        });
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

  const narrowDown = (num: number) => {};

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
          <ResponsiveDrawer
            contents={
              <>
                <Toolbar className="gap-4 fixed bg-white w-full z-50">
                  <Chip
                    label={t.all}
                    variant="outlined"
                    onClick={() => {
                      narrowDown(0);
                    }}
                  />
                  <Chip
                    label={t.image}
                    variant="outlined"
                    onClick={() => {
                      narrowDown(1);
                    }}
                  />
                  <Chip
                    label={t.music}
                    variant="outlined"
                    onClick={() => {
                      narrowDown(2);
                    }}
                  />
                  <Chip
                    label={t.text}
                    variant="outlined"
                    onClick={() => {
                      narrowDown(3);
                    }}
                  />
                  <Chip
                    label={t.video}
                    variant="outlined"
                    onClick={() => {
                      narrowDown(4);
                    }}
                  />
                </Toolbar>
                <Grid
                  container
                  sx={{
                    padding: "88px 64px 24px",
                    gap: "24px",
                  }}
                >
                  {[
                    {
                      title: "Unkoman",
                      img: "/sampleImage/6.png",
                      user: {
                        name: "DeepRecommend",
                        image: "/sampleImage/17.png",
                      },
                    },
                    {
                      title: "I am very lucky",
                      img: "/sampleImage/7.png",
                      user: {
                        name: "Jin Sugimoto",
                        image: "/sampleImage/16.png",
                      },
                    },
                    {
                      title: "chanchan charachara",
                      img: "/sampleImage/8.png",
                      user: {
                        name: "AI man",
                        image: "/sampleImage/15.png",
                      },
                    },
                    {
                      title: "CCCCC",
                      img: "/sampleImage/9.png",
                      user: {
                        name: "Unkown",
                        image: "/sampleImage/14.png",
                      },
                    },
                    {
                      title: "Nekoni koban",
                      img: "/sampleImage/10.png",
                      user: {
                        name: "Kabochan",
                        image: "/sampleImage/13.png",
                      },
                    },
                    {
                      title: "HHH",
                      img: "/sampleImage/11.png",
                      user: {
                        name: "Sobakasu",
                        image: "/sampleImage/12.png",
                      },
                    },
                    {
                      title: "Quick",
                      img: "/sampleImage/12.png",
                      user: {
                        name: "Nikibi",
                        image: "/sampleImage/11.png",
                      },
                    },
                    {
                      title: "Bird",
                      img: "/sampleImage/13.png",
                      user: {
                        name: "Mohikan",
                        image: "/sampleImage/10.png",
                      },
                    },
                    {
                      title: "Black Sigma",
                      img: "/sampleImage/14.png",
                      user: {
                        name: "Yamamoto",
                        image: "/sampleImage/9.png",
                      },
                    },
                    {
                      title: "Killer",
                      img: "/sampleImage/15.png",
                      user: {
                        name: "WaqWaqSan",
                        image: "/sampleImage/8.png",
                      },
                    },
                    {
                      title: "Random",
                      img: "/sampleImage/16.png",
                      user: {
                        name: "ChiChiSibori",
                        image: "/sampleImage/7.png",
                      },
                    },
                    {
                      title: "Easy pencil",
                      img: "/sampleImage/17.png",
                      user: {
                        name: "Kosan",
                        image: "/sampleImage/6.png",
                      },
                    },
                  ].map((content, index) => (
                    <Grid
                      item
                      key={index}
                      sx={{
                        width: "calc((100% / 4) - 48px)",
                      }}
                    >
                      <img src={content.img} />
                      <div style={{ display: "flex", padding: "8px" }}>
                        <Avatar
                          src={content.user.image}
                          sx={{ width: 32, height: 32 }}
                        />
                        <div className="pl-2">
                          <h1
                            style={{
                              fontSize: "20px",
                              fontWeight: 500,
                              overflow: "hidden",
                              display: "block",
                              maxHeight: "4rem",
                              textOverflow: "ellipsis",
                              whiteSpace: "normal",
                            }}
                          >
                            {content.title}
                          </h1>
                          <p>{content.user.name}</p>
                        </div>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </>
            }
          />
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Home;
