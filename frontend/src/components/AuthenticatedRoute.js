import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default ({ component: C, token: token, ...rest }) => (
  <Route {...rest} render={props => (
    token !== null
      ? <C {...props} />
      : <Redirect to={`/login?redirect=${props.location.pathname}${props.location.search}`} />
  )} />
);
