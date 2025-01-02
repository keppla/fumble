import { FC } from 'react';
import { NavLink, useParams } from 'react-router-dom';


export const TopBar: FC = () => {
  const { tab, code } = useParams<{ code: string, tab: string }>();

  return (
    <nav id="mainnav">
        <NavLink
          to={ `/${ code }/dice` }
          className="dice"
        >
          Dice
        </NavLink>

        <NavLink
          to={ `/${ code }/throw` }
          className="throw"
        >
          Throw
        </NavLink>

        <NavLink
          to={ `/${ code }/stats` }
          className="stats"
      >
          Stats
        </NavLink>
    </nav>
  );

}
