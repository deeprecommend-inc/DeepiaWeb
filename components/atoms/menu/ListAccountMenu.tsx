import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import { AuthCurrentUserDto } from "../../../libs/auth/session/dto/auth.current.user.dto";
import { useAppSelector } from "../../../redux/hooks";
import EmailIcon from "@mui/icons-material/Email";
import {
  Avatar,
  Button,
  DialogActions,
  ListItemIcon,
  MenuItem,
} from "@mui/material";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useLocale } from "../../../hooks/useLocale";
import { useRouter } from "next/router";

const ListAccountMenu = ({ close }) => {
  const [open, setOpen] = useState(false);
  const currentUser: AuthCurrentUserDto = useAppSelector(
    (state) => state.auth.currentUser
  );
  const { t } = useLocale();
  const dark = useAppSelector((state) => state.ui.dark);
  const router = useRouter();

  return (
    <>
      <MenuItem
        onClick={() => {
          router.push("/" + currentUser.name);
        }}
      >
        {currentUser?.image ? (
          <Avatar src={currentUser?.image} sx={{ width: 32, height: 32 }} />
        ) : (
          <Avatar sx={{ width: 32, height: 32 }}>
            <PersonIcon />
          </Avatar>
        )}
        {currentUser?.name}
      </MenuItem>

      <Dialog open={open}>
        <DialogTitle>{t.account.name}</DialogTitle>
        <List sx={{ pt: 0, width: "300px" }}>
          <ListItem button key={`name:${currentUser?.name}`}>
            <ListItemIcon>
              <DriveFileRenameOutlineIcon />
            </ListItemIcon>
            <ListItemText primary={currentUser?.name} />
          </ListItem>
          <ListItem button key={`email:${currentUser?.email}`}>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText primary={currentUser?.email} />
          </ListItem>
        </List>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              close();
            }}
            style={{ color: dark ? "#B8B8B8" : "#707070" }}
          >
            {t.form.close}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListAccountMenu;
