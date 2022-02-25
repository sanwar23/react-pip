import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
// import Menu from "../Menu";
import MenuBtn from "../Menu";

export default function Header() {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <MenuIcon /> */}
          <MenuBtn />
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task
          </Typography> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
