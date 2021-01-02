import * as React from 'react';
import { FC, useRef, useEffect, useMemo } from 'react';

import { useParams } from 'react-router-dom';
import { Chart } from 'chart.js';

import { parse, possibilities, Incidence } from '../fumblecode';


export const StatsTab: FC = () => {

  const { code } = useParams<{ code: string }>();

  const config = useMemo(() => {
    const incidences = getIncidences(code);
    return {
      type: 'bar',
      data: {
        labels: incidences.map(inc => inc.value),
        datasets: [{
          label: "Probability",
          data: incidences.map(inc => inc.percent.toFixed(1)),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      }
    };
  }, [ code ]);

  return (
    <section id="stats">
      <ChartDisplay
        config={ config }
        width={ 200 }
        height={ 200 }
      />
    </section>
  );
}


interface ChartDisplayProps {
    config: any,
    width: number,
    height: number,
    className?: string,
}


const ChartDisplay: FC<ChartDisplayProps> = ({ config }) => {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => { new Chart(ref.current!, config); }, []);

    return (
      <canvas
          ref={ ref }
          width={ config.width }
          height={ config.width }
          className={ config.className || '' }
      />
    )
}


function getIncidences(code: string): Incidence[] {
  try {
    return possibilities(parse(code));
  }
  catch (err) {
    console.log("could not parse", err);
    return [];
  }
}
