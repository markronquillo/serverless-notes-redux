import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';

import Home from './containers/Home';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Confirmation from './containers/Confirmation';
import NewNote from './containers/NewNote';
import Notes from './containers/Notes';

import NotFound from './containers/NotFound';

import AppliedRoute from './components/AppliedRoute';

export default ({ token }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} token={token} />
    <UnauthenticatedRoute path="/login" exact component={Login} token={token} />
    <UnauthenticatedRoute  path="/signup" exact component={Signup} token={token} />
    <UnauthenticatedRoute  path="/confirmation" exact component={Confirmation} token={token} />
    <AuthenticatedRoute  path="/notes/new" exact component={NewNote} token={token} />
    <AuthenticatedRoute  path="/notes/:id" exact component={Notes} token={token} />
    <Route component={NotFound} />
  </Switch>
);
