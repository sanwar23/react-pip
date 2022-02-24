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

const issueReducer = (state = initialState, action) => {
  console.log(state);
  console.log(action);

  switch (action.type) {
    case "add_issue":
      return {
        title: action.payload.title,
        type: action.payload.type,
        description: action.payload.description,
        assignee: action.payload.assignee,
        milestone: action.payload.milestone,
        label: action.payload.label,
        group: action.payload.group,
      };

    default:
      return state;
  }
};
export default issueReducer;
