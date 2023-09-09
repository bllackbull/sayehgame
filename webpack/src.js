const checkStream = require("./checkStream");
const checkVideo = require("./checkVideo");

setInterval(() => {
  checkStream();
  checkVideo();
}, 5 * 60 * 1000);