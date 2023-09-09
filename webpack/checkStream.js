const TwitchAPI = require("node-twitch").default;
const twitch = new TwitchAPI({
  client_id: "lh66uuow4pk6u3t8zu8aqep242yr6m",
  client_secret: "c0jnge0sw5bwa5ogetigryqaf34lfu",
  access_token: "bpl4y9hmovruk3vfgdc937gbanmgpm",
  refresh_token: "mq52sh1owz2p3bakfr1l2eed2q5boyaib400h285t3oe4nk7u5",
});

async function checkStream() {
  try {
    const data = await twitch.getStreams({ channel: ["sayeh"] });
    const result = data.data[0];

    const streamIsLive = localStorage.getItem("streamIsLive");
    const streamTitle = localStorage.getItem("streamTitle");
    const streamView = localStorage.getItem("streamView");
    const streamCategory = localStorage.getItem("streamCategory");

    if (result !== undefined && result.type === "live") {
      if (
        streamIsLive === "false" ||
        streamTitle !== result.title ||
        streamView !== result.viewer_count ||
        streamCategory !== result.game_name
      ) {
        const streamData = {
          streamIsLive: true,
          streamUsername: result.user_name,
          streamAlertEN: "Sayeh is now Live!",
          streamAlertFA: "سایه لایو شد!",
          streamTitle: result.title,
          streamView: result.viewer_count,
          streamCategory: result.game_name,
          streamThumbnail: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${result.user_name.toLowerCase()}-1920x1080.jpg?NgOqCvLCECvrHGtf=1`,
        };

        for (const key in streamData) {
          localStorage.setItem(key, streamData[key]);
        }
      }
    } else if (streamIsLive === "true") {
      const streamData = {
        streamIsLive: false,
        streamUsername: "Sayeh",
        streamAlertEN: "Sayeh is currently Offline.",
        streamAlertFA: "سایه آفلاینه!",
        streamTitle: "Stream is Offline...",
        streamView: "",
        streamCategory: "",
        streamThumbnail:
          "https://static-cdn.jtvnw.net/jtv_user_pictures/3439ad7b-cf49-4c6b-a4ac-ce047ab4bacb-channel_offline_image-1920x1080.jpeg",
      };

      for (const key in streamData) {
        localStorage.setItem(key, streamData[key]);
      }
    }
  } catch (error) {
    console.log("Error fetching twitch data:", error);
  }
}

module.exports = checkStream;
