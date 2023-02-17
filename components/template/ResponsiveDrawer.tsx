import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import Logo from "../atoms/Logo";
import LeftNav from "../organisms/LeftNav";
import { TabPanels } from "../molecules/TabPanels";
import AccountMenu from "../atoms/menu/AccountMenu";
import { useAppSelector } from "../../redux/hooks";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import AddIcon from "@mui/icons-material/Add";

const drawerWidth = 240;
const drawerHeight = 148;

type Props = {
  contents: any;
  window?: () => Window;
};

export const ResponsiveDrawer = (props: Props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const container =
    window !== undefined ? () => window().document.body : undefined;
  const dark = useAppSelector((state) => state.ui.dark);
  const isAfterLogin = useAppSelector((state) => state.auth.isAfterLogin);
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: dark ? "" : "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <IconButton>
              <AddIcon />
            </IconButton>
            {isAfterLogin ? (
              <AccountMenu />
            ) : (
              <Button
                className="ml-4"
                onClick={() => {
                  router.push("/login");
                }}
              >
                Log in
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {<LeftNav key={"left-nav-1"} />}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {<LeftNav key={"left-nav-2"} />}
        </Drawer>
      </Box>
      <Box
        component="main"
        className="scroll-container"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {props.contents}
      </Box>
    </Box>
  );
};

export default ResponsiveDrawer;
