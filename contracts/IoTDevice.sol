// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library SafeMath {
    function tryAdd(
        uint256 a,
        uint256 b
    ) internal pure returns (bool, uint256) {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }

    function trySub(
        uint256 a,
        uint256 b
    ) internal pure returns (bool, uint256) {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }

    function tryMul(
        uint256 a,
        uint256 b
    ) internal pure returns (bool, uint256) {
        unchecked {
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }

    function tryDiv(
        uint256 a,
        uint256 b
    ) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }

    function tryMod(
        uint256 a,
        uint256 b
    ) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return a % b;
    }

    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b <= a, errorMessage);
            return a - b;
        }
    }

    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a / b;
        }
    }

    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a % b;
        }
    }
}

abstract contract Ownable {
    address private _owner;

    constructor() {
        _owner = msg.sender;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == msg.sender, "Ownership Assertion: Caller of the function is not the owner.");
        _;
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        _owner = newOwner;
    }
}

struct DataEntry {
    uint256 timestamp;
    string data;
}

struct Rating {
    uint256 upvotes;
    uint256 downvotes;
}

contract IoTDevice {
    using SafeMath for uint256;

    enum VoteType {
        NONE,
        UPVOTE,
        DOWNVOTE
    }
    address[] private voters;
    mapping(address => VoteType) private voted;


    address[] private subscribers;
    mapping(address => uint256) private expirations; // subscriber address => timestamp of last available data
    mapping(uint256 => string) private data;

    uint256 public pricePerSecond;
    uint256 public startTimestamp;
    string public metadata;

    address private deviceAddress;
    address private revenueRecipient;

    address private owner;
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    event DataWritten(uint256 timestamp);

    constructor(uint256  _pricePerSecond, address _deviceAddress, address _revenueRecipient, address _owner, string memory _metadata) {
        pricePerSecond = _pricePerSecond;
        deviceAddress = _deviceAddress;
        revenueRecipient = _revenueRecipient;
        owner = _owner;

        metadata = _metadata;
        startTimestamp = block.timestamp;
    }

    function setOwner(address _owner)                               public onlyOwner { owner = _owner; }
    function setDeviceAddress(address _deviceAddress)               public onlyOwner { deviceAddress = _deviceAddress; }
    function setRevenueRecipient(address _revenueRecipient)         public onlyOwner { revenueRecipient = _revenueRecipient; }
    function setMetadata(string memory _metadata)                   public onlyOwner { metadata = _metadata; }


    // subscribe an address to the device
    function subscribe(address subscriber) public payable {
        require(msg.value > 0, "Subscription Assertion: Subscription amount should be greater than 0.");
        
        uint256 timestamp = block.timestamp;
        uint256 topUpSeconds = (msg.value).div(pricePerSecond);

        if (expirations[subscriber] < timestamp) {
            if (expirations[subscriber] == 0) {
                subscribers.push(subscriber);
            }
            expirations[subscriber] = timestamp + topUpSeconds;
        } else {
            expirations[subscriber] += topUpSeconds;
        }
    }

    function writeData(uint256 _timestamp, string memory _data) public {
        require(msg.sender == deviceAddress, "Only Device can write data.");

        data[_timestamp] = _data;
        emit DataWritten(_timestamp);
    }

    function readData(uint256 _timestamp) public view returns (DataEntry memory) {
        require(
            expirations[msg.sender] >= _timestamp ||
            msg.sender == owner,
            "Only Subscribers can access data.");

        return DataEntry(_timestamp, data[_timestamp]);
    }

    function readDataRange(uint256 _startTimestamp, uint256 _endTimestamp) public view returns (DataEntry[] memory) {
        require(expirations[msg.sender] >= _endTimestamp, "Only Subscribers can access data.");

        uint256 length = _endTimestamp - _startTimestamp;

        uint256 resultLength = 0;
        uint256[] memory timestamps = new uint256[](length);
        string[] memory dataValues = new string[](length);

        for (uint256 i = 0; i < length; i++) {
            string memory currentData = data[_startTimestamp + i];
            if (bytes(currentData).length > 0) {
                timestamps[i] = _startTimestamp + i;
                dataValues[i] = currentData;

                resultLength++;
            }
        }

        DataEntry[] memory result = new DataEntry[](resultLength);

        uint256 resultIndex = 0;
        for (uint256 i = 0; i < length; i++) {
            if (timestamps[i] == 0) {
                continue;
            }
            else {
                result[resultIndex] = DataEntry(timestamps[i], dataValues[i]);
                resultIndex++;
            }
        }

        return result;
    }

    function withdraw() public {
        address payable _revenueRecipient = payable(revenueRecipient);
        payable(_revenueRecipient).transfer(address(this).balance);
    }

    function getExpirationTimestamp() public view returns (uint256) {
        return expirations[msg.sender];
    }

    function vote(bool _upVote) public {
        uint256 _timestamp = block.timestamp;
        require(expirations[msg.sender] >= _timestamp, "Only Subscribers can vote.");

        if (voted[msg.sender] == VoteType.NONE) {
            voters.push(msg.sender);
        }

        voted[msg.sender] = _upVote ? VoteType.UPVOTE : VoteType.DOWNVOTE;
    }

    function getRating() public view returns (Rating memory) {
        uint256 upvotes = 0;
        uint256 downvotes = 0;

        for (uint256 i = 0; i < voters.length; i++) {
            if (voted[voters[i]] == VoteType.UPVOTE) {
                upvotes++;
            } else if (voted[voters[i]] == VoteType.DOWNVOTE) {
                downvotes++;
            }
        }

        return Rating(upvotes, downvotes);
    }

    //function getSubscribers() public onlyOwner returns (address[] memory)  {
    //    for (uint256 i = 0; i < subscribers.length; i++) {
    //        // remove expired subscribers
    //        if (expirations[subscribers[i]] < block.timestamp) {
    //            subscribers[i] = subscribers[subscribers.length - 1];
    //            subscribers.pop();
    //        }
    //    }
    //    return subscribers;
    //}
   
}
