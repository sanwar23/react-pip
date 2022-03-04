import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Box } from '@material-ui/core';
import { TextField, Typography, Grid, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { loginUser } from '../../redux-saga/actions/login';

const useStyles = makeStyles({
  field: {
    marginTop: 50,
    marginBottom: 20,
    display: 'block',
  },
});

const Home = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const initialState = {
    username: '',
    password: '',
    btn: 'Sign In',
    errors: {
      username: '',
      password: '',
    },
  };

  const [login, setLogin] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case 'username':
        setLogin({
          ...login,
          username: value,
          errors: {
            username: value.length < 0 ? 'Username should Not be empty !!' : '',
          },
        });
        break;

      case 'password':
        setLogin({
          ...login,
          password: value,
          errors: {
            password: value.length < 0 ? 'Password should Not be empty !!' : '',
          },
        });
        break;

      default:
        break;
    }
  };

  const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => {
      console.log(val);
      if (val.length > 0) {
        valid = false;
      }
    });
    return valid;
  };

  const handleValidation = (login) => {
    let formIsValid = true;
    var usernameError = '';
    var passwordError = '';

    if (login.username === '') {
      usernameError = 'Username should Not be empty !!';
      formIsValid = false;
    }

    if (login.password === '') {
      passwordError = 'Password should Not be empty !!';
      formIsValid = false;
    }

    setLogin({
      ...login,
      errors: {
        username: usernameError,
        password: passwordError,
      },
    });

    return formIsValid;
  };

  const submitForm = () => {
    // if (validateForm(login.errors)) {
    if (handleValidation(login)) {
      dispatch(loginUser(login));
    }
    // }
  };

  return (
    <Container>
      <Grid container className="Header" style={{ margin: '200px 0' }}>
        <Grid item sm={12}>
          <Typography variant="h5" component="h5" color="primary" gutterBottom>
            Login
          </Typography>
        </Grid>
        <Box
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Grid item sm={4}>
            <form noValidate autoComplete="off">
              <Grid item sm={12} class="mtb-20">
                <TextField
                  type="text"
                  label="Username"
                  name="username"
                  variant="outlined"
                  onChange={handleChange}
                  fullWidth
                  value={login.username}
                  className={classes.field}
                />
                <Typography color="red" gutterBottom>
                  {login.errors.username && (
                    <span className="error">{login.errors.username}</span>
                  )}
                </Typography>
              </Grid>

              <Grid item sm={12} class="mtb-20">
                <TextField
                  type="password"
                  label="Password"
                  name="password"
                  variant="outlined"
                  onChange={handleChange}
                  value={login.password}
                  fullWidth
                  className={classes.field}
                />
                <Box>
                  <Typography color="red" gutterBottom>
                    {login.errors.password && (
                      <span className="error">{login.errors.password}</span>
                    )}
                  </Typography>
                </Box>
              </Grid>

              <Grid item sm={12} class="mtb-20">
                <Button
                  type="button"
                  variant="contained"
                  size="large"
                  onClick={submitForm}
                >
                  {login.btn}
                </Button>
              </Grid>
            </form>
          </Grid>
        </Box>
      </Grid>
    </Container>
  );
};

export default Home;
