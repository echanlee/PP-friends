import React from "react";
import {
    HashRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import Register from "./Register";
import ProfileForm from "./CreateProfile"
import Login from "./Login";
import SwipeProfiles from "./SwipeProfiles";
import Matches from "./Matches";
import Questionnaire from './Questionnaire';
import Messages from './Messages';
import ViewProfile from './ViewProfile';
import EditProfile from './EditProfile';

export default class App extends React.Component {
    render() {

        return (
            <Router>
                <div>
                    <Switch>
                        <Route path="/createprofile">
                            <ProfileForm />
                        </Route>
                        <Route path="/viewprofile">
                            <ViewProfile />
                        </Route>
                        <Route path="/editprofile">
                            <EditProfile />
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
                        <Route path="/questionnaire">
                            <Questionnaire />
                        </Route>
                        <Route path="/messages">
                            <Messages />
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