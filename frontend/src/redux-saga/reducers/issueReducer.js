const initialState = {
  title: '',
  type: '',
  description: '',
  assignee: '',
  milestone: '',
  label: '',
  group: '',
};

const issueReducer = (state = initialState, action) => {
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
        title: 'HIIIIIIIIIIIIIIIIIIIIIIII',
      };

    default:
      return state;
  }
};
export default issueReducer;
