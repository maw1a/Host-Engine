pragma solidity ^0.4.8;

contract lookup {
    struct Page {
        address owner;
        string cid;
    }

    mapping(bytes32 => Page) public pages;

    function stringToBytes32(string memory source)
        public
        pure
        returns (bytes32 result)
    {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    function addPage(string name, string cid) public {
        bytes32 tmp = stringToBytes32(name);
        if (bytes(pages[tmp].cid).length == 0) {
            pages[tmp] = Page(msg.sender, cid);
        }
    }

    function updatePage(string name, string cid) public {
        bytes32 tmp = stringToBytes32(name);
        if (
            bytes(pages[tmp].cid).length != 0 && pages[tmp].owner == msg.sender
        ) {
            pages[tmp] = Page(msg.sender, cid);
        }
    }

    function fetchPage(string name) public view returns (string) {
        Page storage page = pages[stringToBytes32(name)];
        return page.cid;
    }
}
