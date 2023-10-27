const apiKey = "AIzaSyD4uvaAqLkxw1xYdRrrMaceqO_WuTdK8Q8";
const channelId = "UCRyvm_KWqZxQio5EOES5NQw";

const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const ytCoversData = [
      {
        title: data.items[0].snippet.title,
        imgLinks: `https://img.youtube.com/vi/${data.items[0].id.videoId}/maxresdefault.jpg`,
        id: 1,
        link: `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`,
      },
      {
        title: data.items[1].snippet.title,
        imgLinks: `https://img.youtube.com/vi/${data.items[1].id.videoId}/maxresdefault.jpg`,
        id: 2,
        link: `https://www.youtube.com/watch?v=${data.items[1].id.videoId}`,
      },
      {
        title: data.items[2].snippet.title,
        imgLinks: `https://img.youtube.com/vi/${data.items[2].id.videoId}/maxresdefault.jpg`,
        id: 3,
        link: `https://www.youtube.com/watch?v=${data.items[2].id.videoId}`,
      },
    ];

    const ytContainer = document.getElementById("yt-container");

    for (let coverItems of ytCoversData) {
      ytContainer.innerHTML += `
               <div class="col-lg-4 col-md-6 col-12 ytCovers-container">
                   <a href="${coverItems.link}" target="_blank">
                   <div class="ytCovers-img-container">
                   <img src="${coverItems.imgLinks}" alt="">
                   </div>
                           
                             <p style="text-align: center;">${coverItems.title}</p>
                   </a>
               </div>`;
    }
  })
  .catch((error) => console.error(error));
