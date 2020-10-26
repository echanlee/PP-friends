import React from "react";
import {
    HashRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import Register from "./Register";
import ProfileForm from "./profile"
import Login from "./Login";
import SwipeProfiles from "./SwipeProfiles";
import Matches from "./Matches";
import Questionnaire from "./Questionnaire";

export default class App extends React.Component {
    render() {

        return (
            <Router>
                <div>
                    <Switch>
                        <Route path="/questionnaire">
                            <Questionnaire />
                        </Route>
                        <Route path="/profile">
                            <ProfileForm />
                        </Route>
                        <Route path="/register">
                            <Register />
                        </Route>
                        <Route path="/main">
                            <SwipeProfiles />
                        </Route>
                        <Route path="/matches">
                            <Matches />
                        </Route>
                        <Route path="/">
                            <Login />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}