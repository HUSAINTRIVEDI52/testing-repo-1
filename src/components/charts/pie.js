import React, { useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as PIEChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
PIEChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChartExample = ({ limit, dailyUsage, setDaysCount, daysCount }) => {
  const Count = dailyUsage.filter((item) => Number(item.blog_count) > 0).length;
  setDaysCount(Count);
  const Active = daysCount;
  const total = limit == 'week' ? 7 : 30;
  const percentage = Math.round((Active / total) * 100, 2);

  const data = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [Active, total - Active],
        backgroundColor: ['rgba(255, 124, 2, 1)', 'rgba(230, 230, 236, 1)'],
        borderWidth: 0
      }
    ]
  };

  const options = {
    plugins: {
      centerTextPlugin: true,
      indicatorPlugin: true,
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    },
    cutout: '80%',
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      }
    },
    animation: {
      animateRotate: true
    }
  };

  let indicatorPlugin = {
    id: 'rotatingIndicator',
    afterDatasetDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;

      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      const radius = (chart.getDatasetMeta(0).data[0].outerRadius + chart.getDatasetMeta(0).data[0].innerRadius) / 2;
      const angle = ((percentage * 360) / 18000) * Math.PI;

      // Calculate indicator position
      const indicatorX = centerX + radius * Math.sin(angle);
      const indicatorY = centerY - radius * Math.cos(angle);

      ctx.save();
      ctx.beginPath();
      ctx.arc(indicatorX, indicatorY, 20, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.borderWidth = 1;
      ctx.strokeStyle = 'rgba(255, 124, 2, 1)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 124, 2, 1)';
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(indicatorX, indicatorY, 15, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 124, 2, 1)';

      ctx.fill();
      ctx.restore();
    }
  };

  // Custom plugin for the center text
  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${percentage}%`, centerX, centerY);
      ctx.restore();
    }
  };

  return (
    <div style={{ maxWidth: '100%', padding: '20' }}>
      {daysCount != -1 && <Doughnut data={data} options={options} plugins={[centerTextPlugin, indicatorPlugin]} />}
    </div>
  );
};

export default DoughnutChartExample;
