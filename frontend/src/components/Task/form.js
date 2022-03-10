import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userAdd, issueAdd, clearIssue } from '../../redux-saga/actions';
import { TextField, Typography, Grid, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import './styles.css';
import { Box } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import MUIRichTextEditor from 'mui-rte';
import Chip from '@mui/material/Chip';
import ChipInput from 'material-ui-chip-input';

import { convertToRaw, ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import Notify from '../Notification';

const useStyles = makeStyles({
  field: {
    marginTop: 50,
    marginBottom: 20,
    display: 'block',
  },
});

const Form = () => {
  const classes = useStyles();

  const initialState = {
    title: '',
    type: '',
    description: '',
    assignee: '',
    milestone: '',
    label: '',
    group: '',
    btn: 'Create Issue',
    cancel_btn: 'Cancel',
    errors: {
      title: '',
    },
  };

  const dispatch = useDispatch();

  const history = useHistory();

  const [task, setTask] = useState(initialState);

  const [content, setContent] = useState('');

  const [chipval, setChipval] = useState([]);

  const myTheme = createTheme();

  Object.assign(myTheme, {
    overrides: {
      MuiIconButton: {
        root: {
          color: '#fff',
        },
      },
      MUIRichTextEditor: {
        root: {
          '& pre': {
            color: '#212121',
          },
        },
        editor: {
          padding: '20px',
          height: '200px',
          maxHeight: '200px',
          overflow: 'auto',
        },
        placeHolder: {
          paddingLeft: 20,
          width: 'inherit',
          position: 'static',
        },
        anchorLink: {
          color: '#FFEB3B',
          textDecoration: 'underline',
        },
        container: {
          border: '1px solid #dbdbdb',
        },
      },
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log('in handle change');
    setTask({
      ...task,
      [name]: value,
    });
  };

  const handleChipInput = (value) => {
    console.log(value);
    console.log(chipval);
    // setChipval(value);
    setTask({
      ...task,
      group: value,
    });
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

  const onEditorChange = (event) => {
    const rteContent = stateToHTML(event.getCurrentContent());

    setTask({
      ...task,
      description: rteContent,
    });
  };

  const handleValidation = (task) => {
    let formIsValid = true;
    var titleError = '';
    var groupError = '';

    if (task.title === '') {
      titleError = 'Title should Not be empty !!';
      formIsValid = false;
    }

    if (task.group.length <= 0) {
      groupError = 'Group should Not be empty !!';
      formIsValid = false;
    }

    setTask({
      ...task,
      errors: {
        title: titleError,
        group: groupError,
      },
    });

    return formIsValid;
  };

  const submitForm = () => {
    if (handleValidation(task)) {
      dispatch(issueAdd(task));
    }
  };

  const { result_data, status } = useSelector((state) => state.issues);

  if (status != '') {
    const emptyState = ContentState.createFromText('');
    const resetValue = JSON.stringify(convertToRaw(emptyState));

    setContent(resetValue);
    setChipval([]);

    dispatch(clearIssue());

    setTask(initialState);

    setTask({
      ...task,
      title: '',
      type: '',
      description: '',
      assignee: '',
      milestone: '',
      label: '',
      group: '',
    });
    console.log(task);
    // history.push('/list-task');
  }

  return (
    <Grid container style={{ margin: '20px 0' }}>
      <Grid item sm={12} className="header-title">
        <Typography variant="h6" fontWeight="600" component="h6">
          New Issue
        </Typography>
      </Grid>
      <Box
        style={{
          width: '100%',
          display: 'flex',
        }}
      >
        <Grid item sm={12} margin="10px">
          <form noValidate autoComplete="off">
            <Grid container margin="20px 0">
              <Grid item sm={2}>
                <Typography
                  className="field-title"
                  margin="16px 25px"
                  fontWeight="600"
                >
                  Title
                </Typography>
              </Grid>

              <Grid item sm={10}>
                <TextField
                  type="text"
                  label="Title"
                  name="title"
                  variant="outlined"
                  onChange={handleChange}
                  value={task.title}
                  fullWidth
                  className={classes.field}
                />
                <Typography margin="10px 0" color="red" gutterBottom>
                  {task.errors.title && (
                    <span className="error">{task.errors.title}</span>
                  )}
                </Typography>
              </Grid>
            </Grid>

            <Grid container margin="20px 0">
              <Grid item sm={2}>
                <Typography
                  className="field-title"
                  margin="16px 25px"
                  fontWeight="600"
                >
                  Type
                </Typography>
              </Grid>

              <Grid item sm={4}>
                <TextField
                  type="text"
                  label="Type"
                  name="type"
                  variant="outlined"
                  onChange={handleChange}
                  value={task.type}
                  fullWidth
                  className={classes.field}
                />
              </Grid>
            </Grid>

            <Grid container margin="30px 0">
              <Grid item sm={2}>
                <Typography
                  className="field-title"
                  margin="16px 25px"
                  fontWeight="600"
                >
                  Description
                </Typography>
              </Grid>

              <Grid item sm={10}>
                <ThemeProvider theme={myTheme}>
                  <MUIRichTextEditor
                    defaultValue={content}
                    label="Type Description Here"
                    onChange={onEditorChange}
                  />
                </ThemeProvider>
              </Grid>
            </Grid>

            <Grid container margin="30px 0">
              <Grid item sm={2}>
                <Typography
                  className="field-title"
                  margin="16px 25px"
                  fontWeight="600"
                >
                  Assignee
                </Typography>
              </Grid>

              <Grid item sm={4}>
                <TextField
                  type="text"
                  label="Assignee"
                  name="assignee"
                  variant="outlined"
                  onChange={handleChange}
                  value={task.assignee}
                  fullWidth
                  className={classes.field}
                />
              </Grid>
            </Grid>

            <Grid container margin="30px 0">
              <Grid item sm={2}>
                <Typography
                  className="field-title"
                  margin="16px 25px"
                  fontWeight="600"
                >
                  Milestone
                </Typography>
              </Grid>

              <Grid item sm={4}>
                <TextField
                  type="text"
                  label="Milestone"
                  name="milestone"
                  variant="outlined"
                  onChange={handleChange}
                  value={task.milestone}
                  fullWidth
                  className={classes.field}
                />
              </Grid>
            </Grid>

            <Grid container margin="30px 0">
              <Grid item sm={2}>
                <Typography
                  className="field-title"
                  margin="16px 25px"
                  fontWeight="600"
                >
                  Label
                </Typography>
              </Grid>

              <Grid item sm={4}>
                <TextField
                  type="text"
                  label="Label"
                  name="label"
                  variant="outlined"
                  onChange={handleChange}
                  value={task.label}
                  fullWidth
                  className={classes.field}
                />
              </Grid>
            </Grid>

            <Grid container margin="30px 0">
              <Grid item sm={2}>
                <Typography
                  className="field-title"
                  margin="16px 25px"
                  fontWeight="600"
                >
                  Group
                </Typography>
              </Grid>

              <Grid item sm={4}>
                <ChipInput
                  label="Group"
                  fullWidth={true}
                  name="group"
                  defaultValue={chipval}
                  onChange={handleChipInput}
                  variant="outlined"
                />

                <Typography margin="10px 0" color="red" gutterBottom>
                  {task.errors.group && (
                    <span className="error">{task.errors.group}</span>
                  )}
                </Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item sm={2} />
              <Grid item sm={1}>
                <Button
                  type="button"
                  variant="contained"
                  size="large"
                  onClick={() => history.push('/')}
                  color="error"
                >
                  {task.cancel_btn}
                </Button>
              </Grid>

              <Grid item sm={4} marginLeft="15px">
                <Button
                  type="button"
                  variant="contained"
                  size="large"
                  onClick={submitForm}
                >
                  {task.btn}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Box>
      {result_data && (
        <Notify isOpen={true} message={result_data} type="success" />
      )}
    </Grid>
  );
};

export default Form;
