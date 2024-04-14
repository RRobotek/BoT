// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IoTDevice.sol";

contract IoTDeviceFactory {
    // Array to store addresses of all devices
    address[] public deviceAddresses;

    // Mapping from creator to list of their devices for access control
    mapping(address => address[]) private creatorToDevices;

    // Event to emit when a new IoTDevice is created
    event DeviceCreated(address indexed deviceAddress, address indexed owner);

    /**
     * @dev Creates a new IoTDevice and stores the address.
     * @param _pricePerSecond The cost per second for using the device.
     * @param _deviceAddress The Ethereum address of the device, possibly for device-specific operations.
     * @param _revenueRecipient The address where the revenue from the device will be sent.
     * @param _owner The owner of the new device.
     * @param _metadata Additional metadata or description for the device.
     */
    function createIoTDevice(
        uint256 _pricePerSecond,
        address _deviceAddress,
        address _revenueRecipient,
        address _owner,
        string memory _metadata
    ) public {
        // Ensure the device address and revenue recipient are not zero addresses
        require(_deviceAddress != address(0), "Device address cannot be zero.");
        require(_revenueRecipient != address(0), "Revenue recipient cannot be zero.");

        // Create a new IoTDevice contract
        IoTDevice newDevice = new IoTDevice(
            _pricePerSecond,
            _deviceAddress,
            _revenueRecipient,
            _owner,
            _metadata
        );

        // Deploy the new contract

        // Convert new IoTDevice to an address and store it
        address newDeviceAddress = address(newDevice);
        deviceAddresses.push(newDeviceAddress);
        creatorToDevices[_owner].push(newDeviceAddress);

        // Emit an event upon successful creation
        emit DeviceCreated(newDeviceAddress, _owner);
    }

    /**
     * @dev Retrieves a list of devices created by a specific user.
     * @param _user The address of the user whose devices to retrieve.
     * @return An array of addresses belonging to the devices created by the user.
     */
    function getUserDevices(address _user) public view returns (address[] memory) {
        return creatorToDevices[_user];
    }
}
