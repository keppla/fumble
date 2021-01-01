import * as React from 'react';


interface ThrowTabProps {
    tokens: Array<{
        type: string,
        value: string
    }>;
    onReroll: () => any;
}


export const ThrowTab: React.SFC<ThrowTabProps> = (props) => (

//<span class="die" data-bind="css: {d4: sides === 4, d6: sides === 6, d8: sides === 8, d10: sides === 10, d12: sides === 12, d20: sides === 20}">
//        <span data-bind="text: value">?</span>
//    </span>


    <section id="throw">
        <p className="formula">
            {props.tokens.map(token => (
                <span className={token.type}>{token.value}</span>
            ))}
        </p>
        <p>
            <button onClick={evt => props.onReroll()}>Reroll</button>
        </p>
    </section>
);
