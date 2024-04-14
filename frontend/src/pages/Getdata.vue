<template>
    <!-- <Dialog v-model:visible="visible" modal :header='"Sensor: " + selectedSensor.name'
        :style="{ width: '50rem', height: '50rem' }">

        <div class="flex flex-col justify-between">

            <div class="h-6/12">
                <Chart type="line" :data="chartData" :options="chartOptions" class="h-50rem" />
            </div>


            <div class="flex h-6/12 justify-between">
                <div>
                    <h1 class="text-lg">Sensor Information</h1>
                    <p>Sample Time: {{ selectedSensor.sampleTime }}</p>
                    <p>Upkeep Cost: {{ selectedSensor.upkeepCost }}</p>
                    <p>Type: {{ selectedSensor.type }}</p>
                    <p>Unit: {{ selectedSensor.unit }}</p>
                </div>
                <div>
                    <h1 class="text-lg">Location</h1>
                    <p>Latitude: {{ selectedSensor.location.lat }}</p>
                    <p>Longitude: {{ selectedSensor.location.lng }}</p>
                </div>
            </div>

        </div>




    </Dialog> -->


    <!-- in the middle -->
    <div class="flex flex-grow align-middle h-screen">
        <div class="border-2 flex justify-center w-3/12">
            <DataTable selectionMode="single" @row-select="selectionChanged()" v-model:selection="selectedSensor"
                :value="sensors" removableSort paginator :rows="7" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="">
                <Column field="name" header="Name" sortable style="width: 100%"></Column>
                <!-- <Column field="type" header="Type" sortable style="width: 40%"></Column>
                <Column field="unit" header="Unit" sortable style="width: 20%"></Column> -->

            </DataTable>
        </div>
        <div class="container">
            <GoogleMap pi-key="INSERT_YOUR_GOOGLE_MAPS_API_KEY_HERE" style="width: 100%; height: 100%"
                :center="center" :zoom="12">
                <MarkerCluster>

                    <!-- <Marker v-for="sensor in sensors" @click="showSensor(sensor)"
                        :options="{ position: sensor.location }" :key="sensor.name" /> -->

                    <Marker v-for="sensor in metaStore.sensorList" :options="{ position: sensor.location }"
                        :key="sensor.name" />
                </MarkerCluster>

            </GoogleMap>
        </div>

    </div>

    {{ metaStore.sensorList[0].location }}
</template>

<script setup lang="ts">
import { GoogleMap, Marker, MarkerCluster } from 'vue3-google-map'

import { ref, onMounted } from 'vue'
// import Web3 from 'web3'
// import fs from 'fs';

import { useMetaStore } from '../stores/MetaStore.ts'
import * as sapphire from '@oasisprotocol/sapphire-paratime';
const metaStore = useMetaStore();


onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();

    // Load ABI from the JSON file
    // const abiJson = fs.readFileSync('./abi.json', 'utf-8');
    // const abi: any[] = JSON.parse(abiJson);

    // const contractAddress = '0xA03c4CDB6f1174F7efa649dD7F96E8ccdeC4a656';


    // let web3 = new Web3(window.ethereum);
    // let contract = new web3.eth.Contract(abi, contractAddress)
    // contract.methods.metadata().call()
    //     .then(console.log)
});


const chartData = ref();
const chartOptions = ref();
const center = ref({ lat: 52.37699014195213, lng: 4.89750928319059 })
// const selectedSensor = ref({
//     "name": "",
//     "sampleTime": "",
//     "upkeepCost": "",
//     "type": "",
//     "unit": "",
//     "location": { lat: 0, lng: 0 }
// })
const selectedSensor = ref({
    "name": "",
    "location": { lat: 0, lng: 0 }
})
const visible = ref(false)

const graphLabels = ref([1, 2, 3, 4, 5, 6, 7])
const graphData = ref([65, 59, 80, 81, 56, 55, 40])

const sensors = ref(metaStore.sensorList)
// const sensors = ref([{
//     "name": "t_dezwijger",
//     "sampleTime": "0",
//     "upkeepCost": "0",
//     "type": "temperature",
//     "unit": "°C",
//     "location": { lat: 52.40422790913068, lng: 4.823351571955045 },
//     "contractAdress": ""
// }, {
//     "name": "t_port_1",
//     "sampleTime": "0",
//     "upkeepCost": "0",
//     "type": "temperature",
//     "unit": "°C",
//     "location": { lat: 52.37675025687623, lng: 4.922163622937213 },
//     "contractAdress": ""
// }, {
//     "name": "CO2_vondel_1",
//     "sampleTime": "10",
//     "upkeepCost": "3",
//     "type": "CO2",
//     "unit": "ppm",
//     "location": { lat: 52.35670015657411, lng: 4.861568510858895 }

// }])

function showSensor(sensor) {
    console.log(sensor)
    center.value = sensor.location
    selectedSensor.value = sensor

    // visible.value = true
}

function selectionChanged() {
    showSensor(selectedSensor.value)
}

const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: graphLabels.value,
        datasets: [
            {
                label: selectedSensor.value.name,
                data: graphData.value,
                fill: false,
                borderColor: documentStyle.getPropertyValue('--cyan-500'),
                tension: 0.4
            }
        ]
    };
};
const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}

</script>

<style scoped></style>
