import { FC, useRef, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Chart, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';

import { parse, possibilities, Incidence } from '../fumblecode';


Chart.register(CategoryScale, LinearScale, BarController, BarElement);


export const StatsTab: FC = () => {

  const { code } = useParams<{ code: string }>();

  const config = useMemo(() => {
    const incidences = getIncidences(code!);
    return {
      type: 'bar',
      options: {
        scales: {
          y: {
            max: 100,
            min: 0,
          }
        }
      },
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
    useEffect(() => { 
      const chart = new Chart(ref.current!, config);
      return () => {
        chart.destroy();
      }
    }, []);

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
