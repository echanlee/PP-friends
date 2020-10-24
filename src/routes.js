import Register from './Register';
import React from 'react';
import {Route } from "react-router";

const routes = (
    <Route path="/" component={Register}>
        {/* <Route path="profile" component={MyProfileForm}/> */}
    </Route>
);

export default routes;