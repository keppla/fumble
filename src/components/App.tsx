import { FC } from 'react';
import { Route, Routes } from 'react-router';
import { HashRouter } from 'react-router-dom';

import { DiceTab } from './DiceTab';
import { StatsTab } from './StatsTab';
import { ThrowTab } from './ThrowTab';
import { TopBar } from './TopBar';
import { Redirect } from './Redirect';


export const App: FC = () => (
  <HashRouter>
    <div>
      <Routes>
        <Route
          path="/:code/:tab"
          element={ <TopBar /> }
        >
        </Route>
      </Routes>
      <main>
        <Routes>
          <Route
            path='/'
            element={ <Redirect to="/3d6+2/dice" /> }
          />
          <Route path="/:code/dice" element={ <DiceTab /> } />
          <Route path="/:code/throw" element={ <ThrowTab /> } />
          <Route path="/:code/stats" element={ <StatsTab /> } />
        </Routes>
      </main>
    </div>
  </HashRouter>
);
