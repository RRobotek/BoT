<template>
    <div class="bg-blue-50 min-h-screen flex items-center justify-center">
        <div class="bg-white shadow-xl rounded-2xl p-8 w-96 border border-gray-200">
            <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Add IoT Device</h1>
            <form @submit.prevent="createDevice" class="space-y-5">
                <div>
                    <label for="pricePerSecond" class="block text-sm font-medium text-gray-700">Price Per Second (in wei)</label>
                    <input type="number" id="pricePerSecond" v-model="device.pricePerSecond"
                        class="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required>
                </div>
                <div>
                    <label for="deviceAddress" class="block text-sm font-medium text-gray-700">Device Address</label>
                    <input type="text" id="deviceAddress" v-model="device.deviceAddress"
                        class="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required>
                </div>
                <div>
                    <label for="revenueRecipient" class="block text-sm font-medium text-gray-700">Revenue Recipient Address</label>
                    <input type="text" id="revenueRecipient" v-model="device.revenueRecipient"
                        class="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required>
                </div>
                <div>
                    <label for="metadata" class="block text-sm font-medium text-gray-700">Metadata</label>
                    <textarea id="metadata" v-model="device.metadata"
                        class="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required></textarea>
                </div>
                <button type="submit"
                    class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200">
                    Create Device
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMetaStore } from '../stores/MetaStore';
import * as blockchain from '../composables/blockchain';

const metaStore = useMetaStore();
const device = ref({
    pricePerSecond: '',
    deviceAddress: '',
    revenueRecipient: '',
    metadata: ''
});

async function createDevice() {
    if (!device.value.pricePerSecond || !device.value.deviceAddress || !device.value.revenueRecipient || !device.value.metadata) {
        alert('All fields must be filled out.');
        return;
    }
    try {
        await blockchain.createDevice(
            parseInt(device.value.pricePerSecond),
            device.value.deviceAddress,
            device.value.revenueRecipient,
            metaStore.address,
            device.value.metadata
        );
        alert('Device successfully created!');
    } catch (error) {
        console.error('Failed to create device:', error);
        alert('Failed to create device. See console for more details.');
    }
}
</script>

<style scoped>
h1, label {
    color: #333;
}

input, textarea {
    color: #555;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

button {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>

