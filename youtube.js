const url = "https://api.sayehgame.com/";

fetch(url)
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
  })
  .then((data) => {
    const { youtube } = data;
    const ytCoversData = youtube.sayeh.latest.map((video, index) => ({
      title: video.title,
      imgLink: `https://img.youtube.com/vi/${video.id.slice(
        9
      )}/maxresdefault.jpg`,
      link: video.url,
      id: index + 1,
    }));

    const ytContainer = document.getElementById("yt-container");
    ytContainer.innerHTML = ytCoversData
      .map(
        (cover) => `
        <div class="col-lg-4 col-md-6 col-12 ytCovers-container">
          <a href="${cover.link}" target="_blank">
            <div class="ytCovers-img-container">
              <img src="${cover.imgLink}" alt="YouTube cover image">
            </div>
            <p style="text-align: center;">${cover.title}</p>
          </a>
        </div>`
      )
      .join(""); // Combine all HTML strings efficiently
  })
  .catch((error) => {
    console.error("Failed to fetch YouTube data:", error);
    const ytContainer = document.getElementById("yt-container");
    ytContainer.innerHTML = `<p style="text-align: center; color: #662d91;">Failed to load YouTube videos. Please try again later.</p>`;
  });
