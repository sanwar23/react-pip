import logo from "./logo.svg";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./components/Home";
import Task from "./components/Task";

function App() {
  return (
    <>
      <Router>
        <Route exact path="/" component={Home} />
        <Route exact path="/create-task" component={Task} />
      </Router>
    </>
  );
}

export default App;
