import React, { ReactElement } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link, ListItemSecondaryAction } from "@mui/material";
import { useAppSelector } from "../../../redux/hooks";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type Props = {
  text: string;
  link?: string;
  callback?: () => void;
  iconElement: ReactElement<any, any>;
  isPurple?: boolean;
};

const ListCommonItem = (props: Props) => {
  const { text, link, callback, iconElement, isPurple } = props;
  const dark = useAppSelector((state) => state.ui.dark);

  const listItemTextStyle = {
    color: dark ? "#B8B8B8" : "#707070",
  };

  return (
    <ListItem button key={text} onClick={callback}>
      <ListItemIcon style={{ minWidth: "40px" }}>{iconElement}</ListItemIcon>
      {link ? (
        <Link
          href={link}
          underline="none"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemText primary={text} style={listItemTextStyle} />
        </Link>
      ) : (
        <ListItemText primary={text} style={listItemTextStyle} />
      )}
      {/* {isPurple ? (
        <CheckCircleIcon
          style={{
            color: "purple",
            fontSize: "16px",
          }}
        />
      ) : (
        <></>
      )} */}
    </ListItem>
  );
};

export default ListCommonItem;
