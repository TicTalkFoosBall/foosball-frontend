import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/login";
import Rank from "./components/rank";
import "./App.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route path="/" component={Login} />
          <Route path="/rank" component={Rank} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
