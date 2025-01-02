import { FC, useMemo, useState } from 'react';

import { useParams } from 'react-router-dom';

import { parse, evaluate, display, DisplayToken } from '../fumblecode';
import { XorShiftNumberGenerator } from '../lib';


export const ThrowTab: FC = () => {

  const [ seed, setSeed ] = useState(Math.pow(2, 52) * Math.random());
  const { code } = useParams<{ code: string }>();
  const tokens = useMemo(
    () => getTokens(code!, seed),
    [ code, seed ]
  );

  function handleReroll() {
    setSeed(Math.pow(2, 52) * Math.random());
  }

  return (
    <section id="throw">
      <p className="formula">
        { tokens.map((token, index) => (
          <Token key={ index } token={ token } />
        )) }
      </p>
      <p>
        <button onClick={ handleReroll }>Reroll</button>
      </p>
    </section>
  );
}


const Token: FC<{ token: DisplayToken }> = ({ token }) => (
  <span className={ `${ token.type } ${ token.sides ? `d${ token.sides }` : '' }` }>
    <span>{ token.value }</span>
  </span>
);


function getTokens(code: string, seed: number): DisplayToken[] {
  try {
    const exp = parse(code);
    return [
        ...display(exp, new XorShiftNumberGenerator(seed)),
        {
            type: 'operator',
            value: '='
        }, {
            type: 'number',
            value: evaluate(exp, new XorShiftNumberGenerator(seed)).toString()
        }
    ];
  }
  catch (err) {
    console.log("could not parse", err);
    return [];
  }
}
