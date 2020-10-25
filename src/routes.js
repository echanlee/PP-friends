import App from './App'
import Register from "./Register";
import ProfileForm from "./profile";
import Matches from './Matches'
import React from "react";
import { Route, IndexRoute } from "react-router";

const routes = (
    <Route path="/" component={App}>
        <IndexRoute component={Register}/>
        <Route path="profile" component={ProfileForm} />
        <Route path="matches" component={Matches} />
    </Route>
);

export default routes;