const apiKey = "AIzaSyDk9jEbgPfyCvFYVF4DtGtsG9V2Az49_Xo";
const channelId = "UCRyvm_KWqZxQio5EOES5NQw";

const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;

async function checkVideo() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {

      const videoId = localStorage.getItem("videoId");
      if (videoId === data.items[0].id.videoId) return;

      const videoData = {
        videoId: data.items[0].id.videoId,
        videoFirstTitle: data.items[0].snippet.title,
        videoFirstUrl: `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`,
        vidoeFirstThumbnail: `https://img.youtube.com/vi/${data.items[0].id.videoId}/maxresdefault.jpg`,
        videoSecondTitle: data.items[1].snippet.title,
        videoSecondUrl: `https://www.youtube.com/watch?v=${data.items[1].id.videoId}`,
        videoSecondThumbnail: `https://img.youtube.com/vi/${data.items[1].id.videoId}/maxresdefault.jpg`,
        videoThirdTitle: data.items[2].snippet.title,
        videoThirdUrl: `https://www.youtube.com/watch?v=${data.items[2].id.videoId}`,
        videoThirdThumbnail: `https://img.youtube.com/vi/${data.items[2].id.videoId}/maxresdefault.jpg`,
      };
      for (const key in videoData) {
        localStorage.setItem(key, videoData[key]);
      }
    })
    .catch((error) => {
      console.log("Error fetching youtube data:", error);
    });
}

module.exports = checkVideo;
