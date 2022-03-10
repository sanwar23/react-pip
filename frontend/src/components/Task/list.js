import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listIssues } from '../../redux-saga/actions';
import { Container, Box, ButtonGroup, Button } from '@material-ui/core';
import Header from '../Header';
import { Row } from './Row';
import queryString from 'query-string';

const List = () => {
  const dispatch = useDispatch();

  const {
    issueList: { data: issuesList, pagination },
  } = useSelector((state) => state.issues);

  const query = new URLSearchParams(window.location.search);

  const project_id = query.get('project_id');

  const issue_id = query.get('issue_id');

  const params = {
    page: '',
    project_id: project_id == null ? '' : project_id,
    issue_id: issue_id == null ? '' : issue_id,
  };
  console.log(params);
  useEffect(() => {
    dispatch(listIssues(params));
  }, []);

  const handlePagination = (page) => {
    if (page == 'next') {
      params.page = pagination.next_page;
    } else if (page == 'prev') {
      params.page = pagination.prev_page;
    }

    dispatch(listIssues(params));
  };

  return (
    <Container>
      <Header title="List Issue" />
      <Box style={{ margin: '30px 0' }}>
        {issuesList?.map((list, index) => (
          <Row data={list} key={index} />
        ))}

        <Box
          style={{
            width: '100%',
            padding: '20px',
            display: 'inline-flex',
            justifyContent: 'center',
          }}
        >
          <ButtonGroup variant="outlined">
            <Button
              variant="outlined"
              disabled={!pagination.prev_page}
              onClick={() => handlePagination('prev')}
            >
              {'< Prev'}
            </Button>
            <Button
              variant="outlined"
              disabled={!pagination.next_page}
              onClick={() => handlePagination('next')}
            >
              {' Next >'}
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    </Container>
  );
};

export default List;
