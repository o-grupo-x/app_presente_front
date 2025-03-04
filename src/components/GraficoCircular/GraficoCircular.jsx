
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';

Chart.register(ChartDataLabels);

export default function GraficoCircular({ data, options }) {
  return <Doughnut data={data} options={options} />;
}
