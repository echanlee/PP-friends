import App from './App'
import Register from "./Register";
import MyProfileForm from "./profile";
import React from "react";
import { Route, IndexRoute } from "react-router";

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Register}/>
    <Route path="profile" component={MyProfileForm} />
  </Route>
);

export default routes;
