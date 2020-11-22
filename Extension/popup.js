const browse = async (e) => {
  e.preventDefault();
  var cid = await lookupContract.methods.fetchPage(e.target[0].value).call(
    { from: "0x7fDB2aA98F957D8db0C0dE8a74471677568e3190" }, // fetch from metamask
    function (err, res) {
      if (err) {
        console.log(err);
      }
      return res || "";
    }
  );

  localStorage.setItem("cid", cid);
  window.open("./main.html");
};

document.getElementById("search-form").addEventListener("submit", browse);

if (typeof web3 !== "undefined") {
  web3 = new Web3(Web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

web3.eth.defaultAccount = web3.eth.accounts[0];

var lookupContract = new web3.eth.Contract(
  [
    {
      constant: false,
      inputs: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "cid",
          type: "string",
        },
      ],
      name: "addPage",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "cid",
          type: "string",
        },
      ],
      name: "updatePage",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "name",
          type: "string",
        },
      ],
      name: "fetchPage",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "",
          type: "bytes32",
        },
      ],
      name: "pages",
      outputs: [
        {
          name: "owner",
          type: "address",
        },
        {
          name: "cid",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "source",
          type: "string",
        },
      ],
      name: "stringToBytes32",
      outputs: [
        {
          name: "result",
          type: "bytes32",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ],
  "0x5dDBD2c385b7b95660413253811779087Db17E21"
);
