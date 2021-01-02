import * as React from 'react';
import { FC } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import { names } from '../util';


export const TopBar: FC = () => {
  const { tab, code } = useParams<{ code: string, tab: string }>();

  return (
    <nav id="mainnav">
        <NavLink
          to={ `/${ code }/dice` }
          className={ names({ dice: true, active: tab === 'dice'}) }
        >
          Dice
        </NavLink>

        <NavLink
          to={ `/${ code }/throw` }
          className={ names({ throw: true, active: tab === 'throw'}) }
        >
          Throw
        </NavLink>

        <NavLink
          to={ `/${ code }/stats` }
          className={ names({ stats: true, active: tab === 'stats'}) }
        >
          Stats
        </NavLink>
    </nav>
  );

}
