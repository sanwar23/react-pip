import React from 'react';
import { Typography, Grid, Icon } from '@mui/material';
import { Box } from '@material-ui/core';
import { getFullDateFromISO, getFromByDate } from '../../../utils/formateDate';
import { ForumOutlined } from '@material-ui/icons';
import { Link } from 'react-router-dom';

const Row = ({ data }) => {
  return (
    <Grid container>
      <Grid container sm={12} className="list-item">
        <Grid item sm={6}>
          <Link to={`/update-task/${data.project_id}/${data.iid}`}>
            <Typography variant="subtitle1" fontWeight="600">
              {data.title}
            </Typography>
          </Link>
          <Typography variant="subtitle1" color="#666666">
            {data.references.short}{' '}
            {' - Created ' + getFromByDate(data.created_at)}
            {' by ' + data.author.name}
          </Typography>
        </Grid>
        <Grid item sm={6} textAlign="right">
          <Box
            style={{
              width: '100%',
              display: 'inline-flex',
              justifyContent: 'right',
            }}
          >
            <Typography textAlign="right" variant="subtitle1" color="#666666">
              <ForumOutlined textAlign="right" />
            </Typography>
            <span style={{ margin: '5px 0 0 5px' }}>
              {data.user_notes_count}
            </span>
          </Box>
          <Typography textAlign="right" variant="subtitle1" color="#666666">
            {' Updated ' + getFromByDate(data.updated_at)}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { Row };
