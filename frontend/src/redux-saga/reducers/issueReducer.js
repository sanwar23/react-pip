const initialState = {
  title: '',
  type: '',
  description: '',
  assignee: '',
  milestone: '',
  label: '',
  group: '',
  result_data: '',
  status: '',
  issueList: {
    data: [],
    pagination: [],
  },
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
        result_data: action.payload.data,
        status: action.payload.status,
      };

    case 'clear_issue':
      return {
        ...state,
        title: '',
        type: '',
        description: '',
        assignee: '',
        milestone: '',
        label: '',
        group: '',
        // result_data: '',
        status: '',
      };

    case 'list_issues':
      return state;

    case 'set_issues':
      console.log(action.payload.data.data);
      return {
        ...state,
        issueList: {
          data: action.payload.data.data,
          pagination: action.payload.data.page,
        },
      };

    default:
      return state;
  }
};
export default issueReducer;
