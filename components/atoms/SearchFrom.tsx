import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import { useLocale } from "../../hooks/useLocale";
import { useAppSelector } from "../../redux/hooks";

export const SearchForm = () => {
  const { t } = useLocale();
  const dark = useAppSelector((state) => state.ui.dark);

  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 400,
        border: "1px solid rgba(0, 0, 0, 0.12)",
        backgroundColor: dark ? "#888888" : "#f5f5f5",
        borderRadius: "24px",
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={t.search}
        inputProps={{ "aria-label": "search" }}
      />
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};
