/*!
 * Start Bootstrap - Creative v6.0.4 (https://startbootstrap.com/theme/creative)
 * Copyright 2013-2020 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
 */
(function ($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
    if (
      location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
      if (target.length) {
        $("html, body").animate(
          {
            scrollTop: target.offset().top - 72,
          },
          1000,
          "easeInOutExpo"
        );
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $(".js-scroll-trigger").click(function () {
    $(".navbar-collapse").collapse("hide");
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $("body").scrollspy({
    target: "#mainNav",
    offset: 75,
  });

  // Collapse Navbar
  var navbarCollapse = function () {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-scrolled");
    } else {
      $("#mainNav").removeClass("navbar-scrolled");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  // Magnific popup calls
  $("#portfolio").magnificPopup({
    delegate: "a",
    type: "image",
    tLoading: "Loading image #%curr%...",
    mainClass: "mfp-img-mobile",
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1],
    },
    image: {
      tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
    },
  });
})(jQuery); // End of use strict

const upload = async (e) => {
  e.preventDefault();

  var file0 = e.target[1].files;

  readmultifiles(file0);

  var dir = file0[0].webkitRelativePath.split("/");
  dir.pop();
  dir = dir.join("/");

  await window.node.files.mkdir(`/${dir}`);

  function readmultifiles(files) {
    var reader = new FileReader();

    function readFile(index, fileData) {
      if (index >= files.length) {
        var fileUpload = Object.keys(files).map((item, index) => ({
          path: `/${files[index].webkitRelativePath}`,
          content: fileData[index],
        }));
        addFile(fileUpload);
        return;
      }
      var file = files[index];

      reader.onload = function (e) {
        var content = e.target.result;
        if (files[index].type.split("/")[0] === "image") {
          content = buffer.Buffer(content);
        }
        fileData.push(content);
        readFile(index + 1, fileData);
      };
      if (files[index].type.split("/")[0] === "image") {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    }

    readFile(0, []);
  }

  async function addFile(files) {
    const res = await window.node.add(files);
    console.log(res);
    const cid = res.cid.string;

    var page_name = document.getElementById("input-address").value;
    console.log(cid, page_name);
    await window.lookupContract.methods
      .addPage(page_name, cid)
      .send({
        from: "0x7fDB2aA98F957D8db0C0dE8a74471677568e3190",
        gas: 3000000,
      })
      .then((res) => {
        console.log(res);
        Swal.fire(
          "Uploaded",
          `Your Website has been Uploaded view it at ${page_name} in our extension`,
          "success"
        );
      })
      .catch((err) => console.log(err));
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const nodeId = "ipfs-" + Math.random();
  const node = await Ipfs.create({ repo: nodeId });
  console.log("Your node: " + nodeId);
  window.node = node;
  const status = node.isOnline() ? "online" : "offline";
  console.log(`Node status: ${status}`);

  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

  web3.eth.defaultAccount = web3.eth.accounts[0];

  window.lookupContract = new web3.eth.Contract(
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
});
