
import 'core-js/fn/object/entries';


import * as React from 'react';
import { Route } from 'react-router';
import { HashRouter } from 'react-router-dom';

import { DiceTab } from './dicetab';
import { StatsTab } from './statstab';
import { ThrowTab } from './throwtab';

import { Model } from '../main';

type Tab = "dice" | "throw" | "stats"


interface AppProps {
    onChangeTab: (tab: Tab) => any,
    activeTab: Tab,
    model: Model,
}

function names(map: {[name: string]: any}): string {
    return Object
            .entries(map)
            .filter(([name, value]) => value)
            .map(([name, value]) => name)
            .join(' ')
}


export const App: React.SFC<AppProps> = props => (
    <HashRouter>
        <div>
            <Route
                path="/:code/:tab"
                render={routeprops => {
                    let tab = routeprops.match.params.tab;
                    return (
                    <nav id="mainnav">
                        <button onClick={props.onChangeTab('dice')}
                                className={names({dice: true, active: tab === 'dice'})}>dice</button>

                        <button onClick={props.onChangeTab('throw')}
                                className={names({throw: true, active: tab === 'throw'})}>throw</button>

                        <button onClick={props.onChangeTab('stats')}
                                className={'stats ' + (routeprops.match.params.tab === 'stats' ? 'active' : '')}>stats</button>
                    </nav>
                    )

            }} />
            <main>
                <Route
                    path="/:code/dice"
                    render={routeprops =>

                        <DiceTab
                            dicecode={routeprops.match.params.code}
                            onDicecodeChange={code => null}
                            onDiceAdd={code => props.model.dice_adder(code)() }
                            onTabChange={tab => props.model.tab_setter(tab)() }
                        />
                    }
                />
                <Route path="/:code/throw" component={ThrowTab} />
                <Route path="/:code/stat" component={StatsTab} />
            </main>
        </div>
    </HashRouter>
);
