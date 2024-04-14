<template>
  <div>
    <nav>
      <div class="flex card justify-between">
        <Menubar :model="items" />
        <div class="p-2">
          <div>
            <!-- Connect-wallet button is visible if the wallet is not connected -->
            <Button class="inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
              v-if="!metaStore.address" @click="connect">Connect wallet</Button>

            <!-- Display part of the connected wallet address -->
            <h1 v-if="metaStore.address">
              {{ displayAddress(metaStore.address) }}
            </h1>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content area -->
    <div>
      <main v-if="connected">
        <router-view />
      </main>

      <main v-if="!connected" class="flex flex-col justify-center items-center h-screen">
        <div class="border border-gray-300 p-8 rounded-lg text-center">
          <img class="w-2/12 mx-auto mb-4" src="/metamask.png" alt="MetaMask">
          <h1 class="text-xl">Connect your wallet to continue</h1>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">

import GraphComponent from '@/components/GraphComponent.vue';

import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useMetaStore } from './stores/MetaStore.ts';
import * as ethers from 'ethers';
import * as sapphire from '@oasisprotocol/sapphire-paratime';

const metaStore = useMetaStore();
const router = useRouter();
const connected = ref(false);
const items = ref([
  { label: 'Home', icon: 'pi pi-home', command: () => router.push('/') },
  { label: 'Create sensor', icon: 'pi pi-plus', command: () => router.push('/Createdevice') },
  { label: 'Devices', icon: 'pi pi-receipt', command: () => router.push('/ListSensors') },
  { label: 'Map view', icon: 'pi pi-receipt', command: () => router.push('/Getdata') }
]);

async function connect() {
  if (window.ethereum) {
    const _ethersProvider = new ethers.BrowserProvider(window.ethereum);
    const _ethersSigner = await _ethersProvider.getSigner();
    const _sapphireProvider = sapphire.wrap(_ethersProvider);
    const _sapphireSigner = sapphire.wrap(_ethersSigner);

    metaStore.ethersProvider = _ethersProvider;
    metaStore.ethersSigner = _ethersSigner;
    metaStore.sapProvider = _sapphireProvider;
    metaStore.sapSigner = _sapphireSigner;
    metaStore.address = await _sapphireSigner.getAddress();
    connected.value = true;
  }
}

function displayAddress(address) {
  return address.slice(0, 4) + '...' + address.slice(-3);
}

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
</script>

<style scoped>
/* CSS styles can be uncommented or expanded as needed */
</style>
