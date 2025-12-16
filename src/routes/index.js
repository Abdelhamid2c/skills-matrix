
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Welcome from '../pages/Welcome';
import Dashboard from '../components/Dashboard';

export default function Routes() {
  return (
    <Switch>
      {/* <Route path="/dashboard" component={Dashboard} /> */}
      <Route path="/" component={Welcome} />
    </Switch>
  );
}
