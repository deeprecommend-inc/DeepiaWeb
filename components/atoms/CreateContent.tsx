import React, { useEffect, useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { AuthCurrentUserDto } from "../../libs/auth/session/dto/auth.current.user.dto";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  ListItemIcon,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { Controller, useForm } from "react-hook-form";
import { REGEXP } from "../../general/utils/regExp";
import { CreateLogDto } from "../../libs/log/session/dto/create.log.dto";
import { setLogList } from "../../redux/reducers/logSlice";
import { logUiController } from "../../libs/log/presentation/log.ui.controler";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { CategoryDto } from "../../libs/category/session/dto/category.dto";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import { useLocale } from "../../hooks/useLocale";
import AddIcon from "@mui/icons-material/Add";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CreateContent = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [isContinuous, setIsContinuous] = useState(false);
  const currentUser: AuthCurrentUserDto = useAppSelector(
    (state) => state.auth.currentUser
  );
  const { handleSubmit, control, reset } = useForm();
  const categories = useAppSelector((state) => state.category.list);
  const categoryIds = categories.map((val) => val.id.toString());
  const dark = useAppSelector((state) => state.ui.dark);
  const { t } = useLocale();

  useEffect(() => {
    resetFormValue();
  }, [open]);

  const toggleIsContinuous = () => {
    setIsContinuous(!isContinuous);
  };

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const createLog = async (data: CreateLogDto) => {
    await setList();
    resetFormValue();

    if (!isContinuous) setOpen(false);
  };

  const setList = async () => {
    const list = await logUiController.findAll();
    dispatch(setLogList(list));
  };

  const resetFormValue = () => {
    reset({
      title: "",
      link: "",
      memo: "",
    });
  };

  return (
    <>
      <IconButton onClick={openDialog}>
        <AddIcon />
      </IconButton>

      <Dialog open={open} maxWidth="xs">
        <form onSubmit={handleSubmit(createLog)}>
          <DialogTitle>{t.dialog.createLog.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t.dialog.createLog.contentText}
            </DialogContentText>
            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <Controller
                name={"title"}
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    label={t.log.title}
                    margin="dense"
                    fullWidth
                    required
                    variant="standard"
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    helperText={error ? error.message : null}
                  />
                )}
                rules={{
                  required: t.form.err.required.title,
                  maxLength: {
                    value: 128,
                    message: t.form.err.maxLen,
                  },
                }}
              />
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select {...field}>
                    <MenuItem value="1">{t.image}</MenuItem>
                    <MenuItem value="2">{t.music}</MenuItem>
                    <MenuItem value="3">{t.text}</MenuItem>
                  </Select>
                )}
                rules={{ required: t.form.err.required.category }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} className="text-black">
              {t.form.canncel}
            </Button>
            <Button type="submit" variant="outlined">
              {t.form.create}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default CreateContent;
