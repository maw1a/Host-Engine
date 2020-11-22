const showData = (data) => {
  document.append(data);
};
(async () => {
  console.log(localStorage.getItem("cid"));
  const node = await Ipfs.create();
  window.node = node;
  const stream = node.cat(localStorage.getItem("cid") + "/index.html");
  let data = "";
  for await (const chunk of stream) {
    data += chunk.toString();
  }

  function purify(content) {
    var regex = [
      /<link[^>]+href=\"((?!https).*?)\"[^>]*>(.*?)<\/link>/g,
      /<link[^>]+href=\"((?!https).*?)\"[^>]*\/>/g,
      /<script[^>]+src=\"((?!https).*?)\"[^>]*>(.*?)<\/script>/g,
      /<script[^>]+src=\"((?!https).*?)\"[^>]*\/>/g,
      /<img[^>]+src=\"((?!https).*?)\"[^>]*\/>/g,
      /<a[^>]+href=\"((?!https).*?)\"[^>]*>(.*?)<\/a>/g,
    ];

    var arr = [];
    regex.forEach((item) => {
      const ars = content.match(item);
      ars ? arr.push(...ars) : null;
    });

    var rep = arr.map((item) => {
      var tmp = item;
      tmp = tmp.replace(
        `href="`,
        `href="https://ipfs.io/ipfs/${localStorage.getItem("cid")}/`
      );
      tmp = tmp.replace(
        `src="`,
        `src="https://ipfs.io/ipfs/${localStorage.getItem("cid")}/`
      );
      return tmp;
    });

    arr.forEach((item, index) => {
      content = content.replace(item, rep[index]);
    });

    return content;
  }

  data = purify(data);
  var newHTML = document.open("text/html", "replace");
  newHTML.write(data);
  newHTML.close();
})();
