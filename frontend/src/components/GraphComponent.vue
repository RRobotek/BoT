<template>
  <canvas ref="chartContainer" style="height: 400px; width: 100%;"></canvas>
</template>

<script setup>
import { ref, onMounted, watchEffect, onBeforeUnmount } from 'vue';
import { Chart, registerables } from 'chart.js';

// Register the necessary Chart.js components
Chart.register(...registerables);

const props = defineProps({
  data: Array
});

const chartContainer = ref(null);
let chartInstance = null;

onMounted(() => {
  watchEffect(() => {
    if (chartInstance) {
      chartInstance.destroy(); // Destroy existing chart instance if present
    }

    if (props.data && props.data.length) {
      const ctx = chartContainer.value.getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: props.data.map(item => new Date(item.time).toLocaleTimeString()),
          datasets: [{
            label: 'Sensor Data',
            data: props.data.map(item => item.data),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          responsive: true
        }
      });
    }
  });
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

