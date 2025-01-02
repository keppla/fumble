import { FC } from 'react';

import { useNavigate, useParams, NavLink } from 'react-router-dom';


export const DiceTab: FC<{}> = () => {

  const { code } = useParams<{ code: string, tab: string }>();
  const navigate = useNavigate();

  function handleDiceCodeChange(code: string) {
    navigate(`/${ code }/dice`)
  }

  function handleDiceCodeAdd(die: string) {
    const newcode = (code!.trim() === '')
        ? die
        : `${ code } + ${ die }`;

    navigate(`/${ newcode }/dice`);
  }

  return (
    <section id="dice">
      <p>
        <textarea
          id="main"
          placeholder="e.g. 3w6 + 2"
          value={ code }
          onChange={evt => handleDiceCodeChange(evt.target.value)}
        />
      </p>

      <p>
        { [4, 6, 8, 10, 12, 20, 100].map(sides =>
          <button
            key={ sides }
            onClick={ () => handleDiceCodeAdd(`w${sides}`) }
          >
            <span className={ `die d${sides}` }>d{ sides }</span>
          </button>
        ) }
      </p>

      <p>
        <button
          className="action"
          onClick={ () => handleDiceCodeChange('') }
        >
          Clear
        </button>

        <NavLink
          className="action"
          to={ `/${ code }/throw` }
        >
          Roll
        </NavLink>
      </p>
    </section>
  );
}
