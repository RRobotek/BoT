<template>
  <div class="max-w-4xl mx-auto p-5">
    <section>
      <h1 class="text-3xl text-center font-bold text-gray-800 mb-4">All Devices</h1>
      <p class="text-gray-600 text-center mb-5">Here you can see the devices streaming to the blockchain.</p>
      <ul>
        <li v-for="(info, address) in deviceInfo" :key="address" class="bg-white rounded-lg shadow-md p-6 mb-4">
          <div class="mb-4">
            <p><strong>Address:</strong> {{ address }}</p>
            <p><strong>Metadata:</strong> {{ info.metadata }}</p>
            <p><strong>Expiration:</strong> {{ info.expirationDate }}</p>
            <p><strong>Votes:</strong> {{ info.votes.upvotes }} / {{ info.votes.downvotes }}</p>
          </div>
          <div class="flex space-x-2 mb-4">
            <button @click="subscribeToDevice(address)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Subscribe
            </button>
            <button @click="toggleView(address)" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Toggle View
            </button>
            <button @click="vote(address, true)" class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
              Upvote
            </button>
            <button @click="vote(address, false)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Downvote
            </button>
          </div>
          <div v-if="expandedView[address]" class="bg-gray-100 p-4 rounded-lg">
            <GraphComponent :data="parseChartData(info.recentData)" />
            <ul v-if="info.recentData">
              <li v-for="(entry, index) in parseRecentData(info.recentData)" :key="index" class="py-1">
                Time: {{ entry.time }} - Data: {{ entry.data }}
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </section>
  </div>
  {{ metaStore.sensorList }}
</template>

<script setup lang="ts">
import GraphComponent from '../components/GraphComponent.vue';
import { ref, reactive, onMounted } from 'vue';
import { useMetaStore } from '../stores/MetaStore';
import * as blockchain from '../composables/blockchain';

const metaStore = useMetaStore();
const deviceInfo = ref({});
const expandedView = reactive({});

async function fetchDeviceInfo() {
  metaStore.sensorList = [];
  const promises = metaStore.deviceAddresses.map(async address => {
    const contract = await blockchain.getDeviceContract(address);
    const metadata = await blockchain.getMetadata(contract);
    const expirationTime = await blockchain.getExpirationTimestamp(contract);
    const expirationDate = new Date(Number(expirationTime) * 1000).toLocaleString();
    const votes = await blockchain.getRating(contract);
    let recentData = null;

    try {
      const _currentTimestamp = Math.floor(Date.now() / 1000);
      if (expirationTime > _currentTimestamp) {
        console.log('Fetching recent data for:', address);
        recentData = await blockchain.readDataRange(contract, _currentTimestamp - 600, _currentTimestamp);
        console.log('Recent data:', recentData);
      }
    } catch (error) {
      console.error('Error fetching recent data:', error);
    }

    deviceInfo.value[address] = {
      metadata,
      expirationTime,
      expirationDate,
      recentData,
      votes
    };
    try {
      let data = JSON.parse(metadata);
      let name = data.name;
      metaStore.sensorList.push({ "name": name, "location": { "lat": parseFloat(data.location.lat), "lng": parseFloat(data.location.lng) } });
    }
    catch (error) {
      console.error('Error parsing metadata:', error);
    }

    await Promise.all(promises);
  });
}

function parseRecentData(recentData) {
  return recentData.map(data => ({
    time: new Date(Number(data[0]) * 1000).toLocaleString(),
    data: JSON.parse(data[1])
  }));
}

async function subscribeToDevice(address) {
  const contract = await blockchain.getDeviceContract(address);
  try {
    await blockchain.subscribe(contract, 0.25);
    alert('Subscription successful!');
  } catch (error) {
    console.error('Subscription failed:', error);
    alert('Subscription failed!');
  }
}

function parseChartData(recentData) {
  return recentData.map(data => ({
    time: Number(data[0]) * 1000,
    data: JSON.parse(data[1]).T
  }));
}

async function vote(address, upVote) {
  const contract = await blockchain.getDeviceContract(address);
  try {
    await blockchain.vote(contract, upVote);
    alert(`Successfully ${upVote ? 'upvoted' : 'downvoted'}!`);
  } catch (error) {
    console.error(`Failed to ${upVote ? 'upvote' : 'downvote'}:`, error);
    alert(`Failed to ${upVote ? 'upvote' : 'downvote'}!`);
  }
}

function toggleView(address) {
  expandedView[address] = !expandedView[address];
}

onMounted(fetchDeviceInfo);
</script>

<style scoped>
/* The scoped attribute means the styles are local to this component only */
</style>

