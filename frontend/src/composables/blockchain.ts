// blockchain.ts

import { useMetaStore } from '../stores/MetaStore';
import { ethers } from 'ethers';



//export function getDeviceContract(address: string) {
//    const metaStore = useMetaStore();
//    const _deviceContract = new ethers.Contract(address, metaStore.deviceABI, metaStore.signer)
//    return _deviceContract;
//}

export function getDeviceContract(address: string) {
    const metaStore = useMetaStore();
    const _deviceContract = new ethers.Contract(address, metaStore.deviceABI, metaStore.sapProvider)
    return _deviceContract;
}


export async function _readData(address: string, timestamp: number) {
    const _deviceContract = getDeviceContract(address);
    const data = await _deviceContract.readData(timestamp);
    return data;
}

export async function _readDataRange(address: string, start: number, end: number) {
    const _deviceContract = getDeviceContract(address);
    const data = await _deviceContract.readDataRange(start, end);
    return data;
}

export async function _getMetadata(address: string) {
    const _deviceContract = getDeviceContract(address);
    const metadata = await _deviceContract.metadata();
    return metadata;
}

export async function _getPricePerSecond(address: string) {
    const _deviceContract = getDeviceContract(address);
    const pricePerSecond = await _deviceContract.pricePerSecond;
    return pricePerSecond;
}

export async function _getExpirationTimestamp(address: string) {
    const _deviceContract = getDeviceContract(address);
    const ts = await _deviceContract.getExpirationTimestamp();
    return ts;
}


export async function _subscribe(address: string, valueEth: number) {
    const _deviceContract = getDeviceContract(address);

    await _deviceContract.subscribe({
        value: ethers.parseEther(valueEth.toString())
    });
}


export async function readData(contract: ethers.Contract, timestamp: number) {
    const data = await contract.readData(timestamp);
    return data;
}

export async function readDataRange(contract: ethers.Contract, start: number, end: number) {
    const metaStore = useMetaStore();
    const data = await contract.connect(metaStore.sapSigner).readDataRange(start, end);
    return data;
}

export async function getMetadata(contract: ethers.Contract) {
    const metaStore = useMetaStore();
    const metadata = await contract.connect(metaStore.sapSigner).metadata();
    return metadata;
}

export async function getPricePerSecond(contract: ethers.Contract) {
    const metaStore = useMetaStore();
    const pricePerSecond = contract.connect(metaStore.sapSigner).pricePerSecond;
    return pricePerSecond;
}

export async function getExpirationTimestamp(contract: ethers.Contract) {
    const metaStore = useMetaStore();
    const ts = await contract.connect(metaStore.sapSigner).getExpirationTimestamp();
    return ts;
}

export async function subscribe(contract: ethers.Contract, valueEth: number) {
    const metaStore = useMetaStore();
    await contract.connect(metaStore.sapSigner).subscribe(
        metaStore.address,
        { value: ethers.parseEther(valueEth.toString()) }
    );
}

///////////////////////////

export async function vote(contract: ethers.Contract, upvote: boolean) {
    const metaStore = useMetaStore();

    const _value = upvote ? 1 : 0;

    await contract.connect(metaStore.sapSigner).vote(_value);
}

export async function getRating(contract: ethers.Contract) {
    const metaStore = useMetaStore();

    const rating = await contract.connect(metaStore.sapSigner).getRating();
    let upvotes = rating.upvotes
    let downvotes = rating.downvotes
    console.log(`upvotes: ${upvotes}, downvotes: ${downvotes}`);

    return {"upvotes": upvotes, "downvotes": downvotes};
}


