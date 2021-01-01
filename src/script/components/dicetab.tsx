import * as React from 'react';


interface DiceTabProps {
    dicecode: string,
    onDicecodeChange: (text: string) => any,
    onDiceAdd: (code: string) => any,
    onTabChange: (tab: string) => any,
}


export const DiceTab: React.SFC<DiceTabProps> = props => (
    <section id="dice">
        <p>
            <textarea id="main"
                      placeholder="e.g. 3w6 + 2"
                      value={props.dicecode}
                      onChange={evt => props.onDicecodeChange(evt.target.value)} />
        </p>
        <p>
            {[4, 6, 8, 10, 12, 20, 100].map(sides =>
                <button onClick={evt => props.onDiceAdd(`w${sides}`)}>
                    <span className={`die d${sides}`}>+</span>
                </button>
            )}
        </p>
        <p>
            <button className="action"
                    onClick={evt => props.onDicecodeChange('')}>Clear</button>

            <button className="action"
                    onClick={evt => props.onTabChange('throw')}>Roll</button>
        </p>
    </section>
);
