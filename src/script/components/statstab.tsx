import * as React from 'react';


interface StatsTabProps {

}

export const StatsTab: React.SFC<StatsTabProps> = props => (
    <section id="stats">
        <canvas data-bind="chart: stats"></canvas>
    </section>
);
