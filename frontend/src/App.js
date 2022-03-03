import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './components/Home';
import Task from './components/Task';
import Login from './components/Login';
import { IsAuth } from './components/IsAuth';

function App() {
  return (
    <>
      <Router>
        <IsAuth>
          <Route exact path="/" component={Home} />
          <Route exact path="/create-task" component={Task} />
        </IsAuth>
        <Route exact path="/login" component={Login} />
      </Router>
    </>
  );
}

export default App;
