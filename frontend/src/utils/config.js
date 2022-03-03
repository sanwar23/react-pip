const config = {
  NODE_BASE_URL:
    process.env.REACT_APP_NODE_BASE_URL || 'http://localhost:4000/api/v1',
  APP_BASE_URL: process.env.REACT_APP_BASE_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  NODE_URL: process.env.REACT_APP_NODE_URL || 'http://localhost:4000',
};

export default config;
