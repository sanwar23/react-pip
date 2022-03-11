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
  errors: {
    title: '',
  },
  issueList: {
    data: [],
    pagination: [],
  },
};

const issueReducer = (state = initialState, action) => {
  console.log(action.payload);
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

    case 'update_issue':
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

    case 'get_issue':
      console.log(action.payload);
      return {
        state,
      };

    case 'set_issue':
      console.log(action.payload.data);
      return {
        ...state,
        title: action.payload.data.title,
        type: action.payload.data.type,
        description: action.payload.data.description,
        assignee: action.payload.data.assignee,
        milestone: action.payload.data.milestone,
        label: action.payload.data.label,
        group: action.payload.data.project_id,
        errors: {
          title: '',
        },
      };

    default:
      return state;
  }
};
export default issueReducer;
