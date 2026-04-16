import React, { useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as LineChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { format } from 'date-fns';

LineChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const ChartLine = ({ dailyUsage }) => {
  const DATA_COUNT = dailyUsage.length;
  const labels = dailyUsage.map((usage) => format(new Date(usage.blog_date), 'MMM dd'));
  const datapoints = dailyUsage.map((usage) => usage.blog_count);

  const CHART_COLORS = {
    default: 'rgba(255, 124, 2, 0.30)', // Light orange
    hovered: 'rgba(255, 124, 2, 1)' // Bright red
  };

  // Create a ref to access the chart instance
  const chartRef = useRef();

  const data = {
    labels,
    datasets: [
      {
        data: datapoints,
        backgroundColor: Array(DATA_COUNT).fill(CHART_COLORS.default),
        borderColor: Array(DATA_COUNT).fill(CHART_COLORS.default),
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      scales: {
        x: {
          ticks: {
            stepSize: 1,
            rotation: 245,
            callback: function (value) {
              return value;
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          grid: {
            display: false
          }
        }
      },

      tooltip: {
        // border-top: 1px solid #E2E4E8
        backgroundColor: '#fff',
        titleColor: '#9D9D9D',
        bodyColor: '#9D9D9D',
        borderColor: '#E2E4E8',
        borderWidth: 1,
        cornerRadius: 8,
        position: 'nearest',
        xAlign: 'center',
        yAlign: 'bottom',
        titleFont: {
          size: 16,
          weight: 'bold',
          family: 'Arial',
          style: 'italic'
        },
        bodyFont: {
          size: 14,
          weight: 'normal',
          family: 'Verdana',
          style: 'normal'
        },
        callbacks: {
          title: (tooltipItems) => {
            return `Generation : ${tooltipItems[0].raw}`;
          },

          label: (tooltipItem) => {
            return `Date: ${tooltipItem.label}`;
          }
        }
      }
    },
    onHover: (event, elements) => {
      const chart = chartRef.current;
      if (!chart) return;

      const dataset = chart.data.datasets[0];
      if (elements.length > 0) {
        const index = elements[0].index;

        dataset.backgroundColor = dataset.backgroundColor.map((color, i) =>
          i === index ? CHART_COLORS.hovered : CHART_COLORS.default
        );
      } else {
        // Reset colors
        dataset.backgroundColor = Array(DATA_COUNT).fill(CHART_COLORS.default);
      }

      chart.update();
    },
    hover: {
      animationDuration: 0 // Disable animation for hover
    }
  };

  return (
    <div>
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  );
};
