import * as React from 'react';
import { FC } from 'react';
import { Route, Redirect } from 'react-router';
import { HashRouter } from 'react-router-dom';

import { DiceTab } from './DiceTab';
import { StatsTab } from './StatsTab';
import { ThrowTab } from './ThrowTab';
import { TopBar } from './TopBar';


export const App: FC = () => (
  <HashRouter>
    <div>
      <Route
        path='/'
        render={ () => <Redirect to="/3w6+2/dice" /> }
        exact={ true }
      />
      <Route
        path="/:code([^/]*)/:tab"
        component={ TopBar }
      />
      <main>
          <Route path="/:code([^/]*)/dice" component={ DiceTab } />
          <Route path="/:code([^/]*)/throw" component={ ThrowTab } />
          <Route path="/:code([^/]*)/stats" component={ StatsTab } />
      </main>
    </div>
  </HashRouter>
);
