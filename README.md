# Decentralized Subscription-Based Content Hosting Platform

Welcome to our project repository, developed during the EthDam2024 Hackathon. Our platform revolutionizes how content is shared and consumed by leveraging a decentralized subscription model. This ensures financial anonymity for both content creators and subscribers, enhancing privacy and security in digital interactions.

## Project Overview

Our platform operates seamlessly with live data feeds, making it ideal for real-time content delivery. It caters to content creators by providing an anonymous channel to receive feedback, enriching the engagement without compromising privacy.

### Problem & Solution

The blockchain world faces a critical shortage of reliable oracles which connect real-world data to blockchain systems. Our solution is a community-driven ecosystem that simplifies the process of creating an oracle. We aim to reduce entry barriers and make operating an oracle not only feasible but also lucrative.

### Key Features

- **Anonymous Transactions**: Both content creators and subscribers engage in financial transactions and feedback sharing without revealing their identities.
- **Incentivized Oracle Ecosystem**: Encourages the community to contribute to the accuracy and reliability of data feeds.
- **Broad Compatibility**: Our platform supports devices as simple as Arduino or Raspberry Pi, integrating them into the blockchain to deliver valuable real-time data.

### Why Oasis?

We chose Oasis for its robust features that support our vision:
- **Encrypted Contract State**: Data privacy is maintained directly on the blockchain.
- **Encrypted Function Calls and Function Data**: Enhances security by preventing bad actors from tracing user actions.
- **Economical**: Low gas fees and gasless transactions are crucial when working with content on the blockchain.

## Other Applications

The flexibility of our platform allows for various applications, including IoT integrations and a decentralized patron system where subscribers can support content creators in exchange for exclusive content. More trivial ideas such as personal blogs or notifications systems can also not be excluded.


## Structure

There are 2 main contracts: IoTDevice and IoTDeviceFacctory. Users interact with both of them through the dapp. IoTDevice is responsible for broadcasting and managing data. IoTDeviceFactory is responsible for creating instances of IoTDevice. This comes in handy since every new contract Device created on the Factory, is available on the front end. This way people don't need to promote or advertise their oracles or services. There is also a voting system that allows the subscribers of a certain Device to rate how well it performs. This system is anonymous just like everything else that is a part of this ecosystem.
