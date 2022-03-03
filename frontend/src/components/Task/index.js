import React from 'react';
import { Container } from '@material-ui/core';
import Header from '../Header';
import Form from './form';

const Task = () => {
  return (
    <Container>
      <Header title="Create Issue" />
      <Form />
    </Container>
  );
};

export default Task;
