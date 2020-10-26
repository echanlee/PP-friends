import React from "react";
import {
    HashRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import Register from "./Register";
import ProfileForm from "./profile"
import Login from "./Login"

export default class App extends React.Component {
    render() {

        return (
            <Router>
                <div>
                    <Switch>
                        <Route path="/profile">
                            <ProfileForm />
                        </Route>
                        <Route path="/register">
                            <Register />
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