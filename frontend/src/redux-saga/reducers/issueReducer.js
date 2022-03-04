const initialState = {
  title: '',
  type: '',
  description: '',
  assignee: '',
  milestone: '',
  label: '',
  group: '',
  success_grp: '',
  status: '',
};

const issueReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case 'add_issue':
      return {
        title: action.payload.title,
        type: action.payload.type,
        description: action.payload.description,
        assignee: action.payload.assignee,
        milestone: action.payload.milestone,
        label: action.payload.label,
        group: action.payload.group,
      };

    case 'submit_issue':
      return {
        ...state,
        success_data: action.payload.data,
        status: action.payload.status,
      };

    default:
      return state;
  }
};
export default issueReducer;
