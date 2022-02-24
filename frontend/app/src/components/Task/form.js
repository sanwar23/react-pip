import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userAdd, issueAdd } from "../../actions";
import { TextField, Typography, Grid, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import "./styles.css";
import { Box } from "@material-ui/core";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import MUIRichTextEditor from "mui-rte";
import { convertToRaw, draftToHtml } from "draft-js";

const useStyles = makeStyles({
  field: {
    marginTop: 50,
    marginBottom: 20,
    display: "block",
  },
});

const Form = () => {
  const classes = useStyles();

  const initialState = {
    title: "",
    type: "",
    description: "",
    assignee: "",
    milestone: "",
    label: "",
    group: "",
    btn: "Create Issue",
    errors: {
      title: "",
    },
  };
  const dispatch = useDispatch();

  const [task, setTask] = useState(initialState);

  const save = (data) => {
    console.log(data);
  };

  const myTheme = createTheme({
    // Set up your custom MUI theme here
  });

  Object.assign(myTheme, {
    overrides: {
      MuiIconButton: {
        root: {
          color: "#fff",
        },
      },
      MUIRichTextEditor: {
        root: {
          "& pre": {
            color: "#212121",
          },
        },
        editor: {
          padding: "20px",
          height: "200px",
          maxHeight: "200px",
          overflow: "auto",
          borderTop: "1px solid gray",
        },
        placeHolder: {
          paddingLeft: 20,
          width: "inherit",
          position: "static",
        },
        anchorLink: {
          color: "#FFEB3B",
          textDecoration: "underline",
        },
        container: {
          border: "1px solid gray",
        },
      },
    },
  });

  const handleChange = (event) => {
    // console.log('asdsadsad')
    const { name, value } = event.target;
    // console.log(name, value)

    switch (name) {
      case "title":
        setTask({
          ...task,
          title: value,
          errors: {
            title: value.length < 0 ? "Title should Not be empty !!" : "",
          },
        });
        break;

      case "type":
        setTask({
          ...task,
          type: value,
          errors: {
            type: value.length < 0 ? "Type should Not be empty !!" : "",
          },
        });
        break;

      case "description":
        setTask({
          ...task,
          description: value,
          errors: {
            description: value.length < 0 ? "Type should Not be empty !!" : "",
          },
        });
        break;

      case "assignee":
        setTask({
          ...task,
          assignee: value,
          errors: {
            assignee: value.length < 0 ? "Type should Not be empty !!" : "",
          },
        });
        break;

      case "milestone":
        setTask({
          ...task,
          milestone: value,
          errors: {
            milestone: value.length < 0 ? "Type should Not be empty !!" : "",
          },
        });
        break;

      case "label":
        setTask({
          ...task,
          label: value,
          errors: {
            label: value.length < 0 ? "Type should Not be empty !!" : "",
          },
        });
        break;

      case "group":
        setTask({
          ...task,
          group: value,
          errors: {
            group: value.length < 0 ? "Type should Not be empty !!" : "",
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

  const onEditorChange = (event) => {
    const plainText = event.getCurrentContent().getPlainText(); // for plain text

    setTask({
      ...task,
      description: plainText,
    });
  };

  const handleValidation = (task) => {
    let fields = task;
    let formIsValid = true;
    var titleError = "";

    if (task.title === "") {
      titleError = "Title should Not be empty !!";
      formIsValid = false;
    }

    setTask({
      ...task,
      errors: {
        title: titleError,
      },
    });

    return formIsValid;
  };

  const submitForm = () => {
    console.log(task);
    if (validateForm(task.errors)) {
      if (handleValidation(task)) {
        dispatch(issueAdd(task));
        // setTask(initialState);
      }
    }
  };

  return (
    <Grid container className="Header" style={{ margin: "20px 0" }}>
      <Grid item sm={12}>
        <Typography variant="h5" component="h5" color="primary" gutterBottom>
          New Issue
        </Typography>
      </Grid>
      <Box
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid item sm={8}>
          <form noValidate autoComplete="off">
            <Grid item sm={12} class="mtb-20">
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
              <Typography color="red" gutterBottom>
                {task.errors.title && (
                  <span className="error">{task.errors.title}</span>
                )}
              </Typography>
            </Grid>
            <Grid item sm={12} class="mtb-20">
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
              <Typography color="red" gutterBottom>
                {task.errors.type && (
                  <span className="error">{task.errors.type}</span>
                )}
              </Typography>
            </Grid>
            <Grid item sm={12} class="mtb-20">
              <ThemeProvider theme={myTheme}>
                <MUIRichTextEditor
                  label="Description"
                  controls={[
                    "numberList",
                    "bulletList",
                    "title",
                    "bold",
                    "italic",
                    "underline",
                    "link",
                    "numberList",
                    "bulletList",
                    "quote",
                    "code",
                    "clear",
                    "save",
                    "media",
                    "strikethrough",
                    "highlight",
                  ]}
                  // value={value}
                  onChange={onEditorChange}
                />
              </ThemeProvider>
              <Typography color="red" gutterBottom>
                {task.errors.description && (
                  <span className="error">{task.errors.description}</span>
                )}
              </Typography>
            </Grid>
            <Grid item sm={12} class="mtb-20">
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
              <Typography color="red" gutterBottom>
                {task.errors.assignee && (
                  <span className="error">{task.errors.assignee}</span>
                )}
              </Typography>
            </Grid>
            <Grid item sm={12} class="mtb-20">
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
              <Typography color="red" gutterBottom>
                {task.errors.milestone && (
                  <span className="error">{task.errors.milestone}</span>
                )}
              </Typography>
            </Grid>
            <Grid item sm={12} class="mtb-20">
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
              <Typography color="red" gutterBottom>
                {task.errors.label && (
                  <span className="error">{task.errors.label}</span>
                )}
              </Typography>
            </Grid>
            <Grid item sm={12} class="mtb-20">
              <TextField
                type="text"
                label="Group"
                name="group"
                variant="outlined"
                onChange={handleChange}
                value={task.group}
                fullWidth
                className={classes.field}
              />
              <Typography color="red" gutterBottom>
                {task.errors.group && (
                  <span className="error">{task.errors.group}</span>
                )}
              </Typography>
            </Grid>
            <Grid item sm={12} class="mtb-20">
              <Button
                type="button"
                variant="contained"
                size="large"
                onClick={submitForm}
              >
                {task.btn}
              </Button>
            </Grid>
          </form>
        </Grid>
      </Box>
    </Grid>
  );
};

export default Form;
