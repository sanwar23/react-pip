import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getIssue } from '../../redux-saga/actions';
import { Container } from '@material-ui/core';
import Header from '../Header';
import UpdateForm from './update_form';
import { useParams } from 'react-router-dom';

const Update = () => {
  const dispatch = useDispatch();

  let { project_id, issue_id } = useParams();

  // console.log(project_id, issue_id);

  const params = {
    project_id: project_id == null ? '' : project_id,
    issue_id: issue_id == null ? '' : issue_id,
  };

  useEffect(() => {
    dispatch(getIssue(params));
  }, []);

  const { issues } = useSelector((state) => state);

  console.log(issues);

  return (
    <Container>
      <Header title="Update Issue" />
      {issues.title && (
        <UpdateForm data={issues} project_id={project_id} issue_id={issue_id} />
      )}
    </Container>
  );
};

export default Update;
