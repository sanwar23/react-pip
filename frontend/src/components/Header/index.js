import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
// import Menu from "../Menu";
import MenuBtn from '../Menu';

export default function Header({ title }) {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <MenuBtn />
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
