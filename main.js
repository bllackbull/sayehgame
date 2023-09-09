///import logo navbar section
const leftNav = document.getElementById("left-nav");
const logoLink = document.createElement("a");
const logoImg = document.createElement("img");

logoLink.href = "http://127.0.0.1:5500/index.html";

logoImg.src = "/Images/logo footer.svg";
logoImg.width = "100";
logoImg.height = "70";
logoImg.alt = "sayeh-website-logo";

logoLink.appendChild(logoImg);
leftNav.appendChild(logoLink);
///import main menu navbar section

const menuItemsData = [
  { enText: "About", faText: "درباره من" },
  { enText: "Twitch", faText: "توییچ" },
  { enText: "Youtube", faText: "یوتیوب" },
  { enText: "Social Media", faText: "شبکه های مجازی" },
  { enText: "Support", faText: "حمایت" },
];

const mainMenu = document.createElement("ul");
mainMenu.id = "main-menu";
for (let items of menuItemsData) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.setAttribute("data-en", items.enText);
  a.setAttribute("data-fa", items.faText);
  a.textContent = items.enText;
  a.href = `#${items.enText.charAt(0).toLowerCase() + items.enText.slice(1)}`;
  a.style.padding = "10px 0";
  a.style.transition = "all ease-in-out 300ms";

  li.appendChild(a);
  mainMenu.appendChild(li);
}
leftNav.appendChild(mainMenu);
////dark mode
const dark = document.getElementById("dark");
const light = document.getElementById("light");

const resDark = document.getElementById("res-dark");
const resLight = document.getElementById("res-light");

const isDarkModeCached = localStorage.getItem("dark-mode");

if (isDarkModeCached === "true") {
  dark.style.display = "none";
  light.style.display = "block";
  resDark.style.display = "none";
  resLight.style.display = "block";

  enableDarkMode();
}

dark.addEventListener("click", function () {
  this.style.display = "none";
  light.style.display = "block";
  resDark.style.display = "none";
  resLight.style.display = "block";

  enableDarkMode();
  saveDarkModeState(true);
});

light.addEventListener("click", function () {
  dark.style.display = "block";
  this.style.display = "none";
  resDark.style.display = "block";
  resLight.style.display = "none";

  disableDarkMode();
  saveDarkModeState(false);
});

resDark.addEventListener("click", function () {
  dark.style.display = "none";
  light.style.display = "block";
  this.style.display = "none";
  resLight.style.display = "block";

  enableDarkMode();
  saveDarkModeState(true);
});

resLight.addEventListener("click", function () {
  dark.style.display = "block";
  light.style.display = "none";
  resDark.style.display = "block";
  this.style.display = "none";

  disableDarkMode();
  saveDarkModeState(false);
});

function enableDarkMode() {
  let element = document.body;
  element.classList.add("dark-mode");
}

function disableDarkMode() {
  let element = document.body;
  element.classList.remove("dark-mode");
}

function saveDarkModeState(isDarkModeEnabled) {
  localStorage.setItem("dark-mode", isDarkModeEnabled);
}
///////////////////////////responsive navbar
const menuItemsResNav = [
  { enText: "About", faText: "درباره من" },
  { enText: "Twitch", faText: "توییچ" },
  { enText: "Youtube", faText: "یوتیوب" },
  { enText: "Social Media", faText: "شبکه های مجازی" },
  { enText: "Support", faText: "حمایت" },
];
// const menuItemsResNav = ["About", "Twitch", "Youtube", "Social Meida", "Support"];
const resNav = document.getElementById("responsive-nav");
const resNavMain = document.getElementById("responsive-nav-main");
const revNavUl = document.createElement("ul");
for (let navItems of menuItemsResNav) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.setAttribute("data-en", navItems.enText);
  a.setAttribute("data-fa", navItems.faText);
  a.textContent = navItems.enText;
  a.href = `#${
    navItems.enText.charAt(0).toLowerCase() + navItems.enText.slice(1)
  }`;

  li.appendChild(a);
  revNavUl.appendChild(li);
}
resNavMain.appendChild(revNavUl);

const mobileMenuLink = document.querySelector("#mobile-menu li a");

mobileMenuLink.addEventListener("click", function (e) {
  e.preventDefault();
  resNav.style.right = "1%";
});

const hideNav = document.getElementById("hide-res-nav");
hideNav.addEventListener("click", function (e) {
  e.preventDefault();
  resNav.style.right = "-100%";
});

///import sayeh profile about section
const imgContainer = document.querySelector("#img-container");
const profileImg = document.createElement("img");
profileImg.src = "/Images/about images/profile.png";
profileImg.alt = "sayeh-profile";
imgContainer.appendChild(profileImg);
///import sayeh profile text about section
const hello = document.createElement("h1");
const name = document.createElement("h1");
const content = document.createElement("p");
content.id = "about-text";
const aboutSection = document.querySelector("#about-section");
hello.textContent = "Hello Guys";
hello.setAttribute("data-fa", "سلام بچه ها");
hello.setAttribute("data-en", "Hello Guys");
name.textContent = "My Name Is SAYEH";
name.setAttribute("data-fa", "من سایه هستم");
name.setAttribute("data-en", "My Name Is SAYEH");

const aboutMeEN = `I'm 32 years old and I live in tehran. I studied Microbiology and I play online games casualy when i'm not busy and recently I've been playing some indie games and I really enjoyed them.
I'm a Twitch partner and I've been streaming in Twitch for more than two years now. 
Sometimes I upload videos on YouTube. I strongly believe in creating a safe and inclusive environment for everyone in my chat.
I promotes respect, kindness and understanding among my viewers `;

const aboutMeFA =
  "من 32 ساله هستم و در تهران زندگی میکنم. میکروبایولوژی خوانده ام و در اوقاتی که مشغول نیستم بازی آنلاین میکنم و اخیرا چند بازی مستقل بازی کردم که خیلی از آن ها لذت بردم. من پارتنر توییچ هستم و برای بیشتر از دو ساله که در توییچ استریم میکنم. گاهی اوقات در یوتیوب ویدیو آپلود میکنم. من به شدت به ایجاد محیطی امن و فراگیر برای همه افراد در چت خود معتقد هستم. من احترام، مهربانی و تفاهم را در بین بینندگانم ترویج میکنم.";

content.textContent = aboutMeEN;
content.setAttribute("data-fa", aboutMeFA);
content.setAttribute("data-en", aboutMeEN);
aboutSection.append(hello, name, content);
///import favorites games about section
const favGames = document.getElementById("fav-games");
const favGamesTitle = document.createElement("p");

favGamesTitle.textContent = "These are the games I usually play in stream";
favGamesTitle.setAttribute(
  "data-fa",
  " بازی هایی  که من معمولاً در استریم بازی می کنم"
);
favGamesTitle.setAttribute(
  "data-en",
  "These are the games I usually play in stream"
);
favGamesTitle.id = "fav-games-title";

const favGamesImgData = [
  { name: "overwatch", src: "/Images/favorites game images", alt: "overwatch" },
  { name: "valorant", src: "/Images/favorites game images", alt: "valorant" },
  { name: "wow", src: "/Images/favorites game images", alt: "wow" },
];

const faveGamesImgContainer = document.createElement("fav-games-img-container");
faveGamesImgContainer.classList =
  "row d-flex justify-content-center align-items-center";
faveGamesImgContainer.id = "fav-games-img-container";

for (let images of favGamesImgData) {
  faveGamesImgContainer.innerHTML += `<img src="/Images/favorites game images/${images.name}.png" alt="${images.alt}" class="col-md-4 col-sm-10 col-10 mt-4">`;
}
favGames.append(favGamesTitle, faveGamesImgContainer);

const streamIsLive = localStorage.getItem("streamIsLive");
const streamAlertEN = localStorage.getItem("streamAlertEN");
const streamAlertFA = localStorage.getItem("streamAlertFA");
const streamTitle = localStorage.getItem("streamTitle");
const streamView = localStorage.getItem("streamView");
const streamCategory = localStorage.getItem("streamCategory");
const streamThumbnail = localStorage.getItem("streamThumbnail");

const twitchTitlesData = [
  streamAlertEN,
  streamAlertFA,
  streamTitle,
  "Streaming ",
  " Viewers : ",
  streamThumbnail,
];
const twitchSpanData = [streamCategory, streamView];

const twitchTitlesSection = document.getElementById("twitchTitles-section");
const twitchAlert = document.getElementById("twitchLive-alert");
const twitchTitle = document.getElementById("twitchLive-title");
const twitchThumbnailLink = document.querySelector(
  "#twitch-container #twitch-container-img"
);
const twitchThumbnail = document.querySelector("#twitch-container img");

twitchThumbnailLink.href = "https://www.twitch.tv/sayeh";
twitchThumbnailLink.target = "_blank";
twitchThumbnail.src = twitchTitlesData[5];
twitchThumbnail.alt = "twitch-live-cover";

twitchAlert.textContent = twitchTitlesData[0];
twitchAlert.setAttribute("data-en", twitchTitlesData[0]);
twitchAlert.setAttribute("data-fa", twitchTitlesData[1]);

twitchTitle.textContent = twitchTitlesData[2];

///span streaming  twitch section
const twitchLiveCategory = document.createElement("p");
twitchLiveCategory.textContent = twitchTitlesData[3];

twitchLiveCategory.id = "twitchLive-category";
twitchTitlesSection.appendChild(twitchLiveCategory);
const twitchCategory = document.createElement("span");
twitchCategory.id = "twitch-category";
twitchCategory.textContent = twitchSpanData[0];
twitchLiveCategory.appendChild(twitchCategory);

///span viewer count  twitch section
const twitchLiveViewCount = document.createElement("p");
twitchLiveViewCount.textContent = twitchTitlesData[4];

twitchLiveViewCount.id = "twitchLive-view-count";
twitchTitlesSection.appendChild(twitchLiveViewCount);
const viewercount = document.createElement("span");
viewercount.id = "viewer-count";
viewercount.textContent = twitchSpanData[1];
twitchLiveViewCount.appendChild(viewercount);

///span twitch link  twitch section
const twitchLink = document.createElement("a");
twitchLink.textContent = "Go To Twitch";
twitchLink.setAttribute("data-en", "Go To Twitch");
twitchLink.setAttribute("data-fa", "برو به توییچ");
twitchLink.href = "https://www.twitch.tv/sayeh";
twitchLink.target = "blank";
twitchTitlesSection.appendChild(twitchLink);

if (streamIsLive === "false") {
  twitchLiveCategory.style.display = "none";
  twitchLiveViewCount.style.display = "none";
}

/////////////import yt covers
const videoFirstTitle = localStorage.getItem("videoFirstTitle");
const videoFirstUrl = localStorage.getItem("videoFirstUrl");
const vidoeFirstThumbnail = localStorage.getItem("vidoeFirstThumbnail");
const videoSecondTitle = localStorage.getItem("videoSecondTitle");
const videoSecondUrl = localStorage.getItem("videoSecondUrl");
const videoSecondThumbnail = localStorage.getItem("videoSecondThumbnail");
const videoThirdTitle = localStorage.getItem("videoThirdTitle");
const videoThirdUrl = localStorage.getItem("videoThirdUrl");
const videoThirdThumbnail = localStorage.getItem("videoThirdThumbnail");

const ytCoversData = [
  {
    title: videoFirstTitle,
    imgLinks: vidoeFirstThumbnail,
    id: 1,
    link: videoFirstUrl,
  },
  {
    title: videoSecondTitle,
    imgLinks: videoSecondThumbnail,
    id: 2,
    link: videoSecondUrl,
  },
  {
    title: videoThirdTitle,
    imgLinks: videoThirdThumbnail,
    id: 3,
    link: videoThirdUrl,
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

// fetch("./json/stream.json")
//   .then((response) => response.json())
//   .then((data) => {
//     const twitchTitlesData = [
//       data.alertEN,
//       data.alertFA,
//       data.title,
//       "Streaming ",
//       " Viewers : ",
//       data.thumbnail,
//     ];
//     const twitchSpanData = [data.category, data.view];

//     const twitchTitlesSection = document.getElementById("twitchTitles-section");
//     const twitchAlert = document.getElementById("twitchLive-alert");
//     const twitchTitle = document.getElementById("twitchLive-title");
//     const twitchThumbnailLink = document.querySelector("#twitch-container #twitch-container-img");
//     const twitchThumbnail = document.querySelector("#twitch-container img");

//     twitchThumbnailLink.href = "https://www.twitch.tv/sayeh";
//     twitchThumbnailLink.target = "_blank";
//     twitchThumbnail.src = twitchTitlesData[5];
//     twitchThumbnail.alt = "twitch-live-cover";

//     twitchAlert.textContent = twitchTitlesData[0];

//     if (localStorage.getItem("lang") === "en") {
//       twitchAlert.setAttribute("data-en", twitchTitlesData[0]);
//     } else {
//       twitchAlert.setAttribute("data-fa", twitchTitlesData[1]);
//     }

//     twitchTitle.textContent = twitchTitlesData[2];
//     ///span streaming  twitch section
//     const twitchLiveCategory = document.createElement("p");
//     twitchLiveCategory.textContent = twitchTitlesData[3];

//     twitchLiveCategory.id = "twitchLive-category";
//     twitchTitlesSection.appendChild(twitchLiveCategory);
//     const twitchCategory = document.createElement("span");
//     twitchCategory.id = "twitch-category";
//     twitchCategory.textContent = twitchSpanData[0];
//     twitchLiveCategory.appendChild(twitchCategory);
//     ///span viewer count  twitch section
//     const twitchLiveViewCount = document.createElement("p");
//     twitchLiveViewCount.textContent = twitchTitlesData[4];

//     twitchLiveViewCount.id = "twitchLive-view-count";
//     twitchTitlesSection.appendChild(twitchLiveViewCount);
//     const viewercount = document.createElement("span");
//     viewercount.id = "viewer-count";
//     viewercount.textContent = twitchSpanData[1];
//     twitchLiveViewCount.appendChild(viewercount);
//     ///span twitch link  twitch section
//     const twitchLink = document.createElement("a");
//     twitchLink.textContent = "Go To Twitch";
//     twitchLink.setAttribute("data-en", "Go To Twitch");
//     twitchLink.setAttribute("data-fa", "برو به توییچ");
//     twitchLink.href = "https://www.twitch.tv/sayeh";
//     twitchLink.target = "blank";
//     twitchTitlesSection.appendChild(twitchLink);

//     if (!data.isLive) {
//       twitchLiveCategory.style.display = "none";
//       twitchLiveViewCount.style.display = "none";
//     }
//   })
//   .catch((error) => console.error);

// /////////////import yt covers
// fetch("./json/video.json")
//   .then((response) => response.json())
//   .then((data) => {
//     const ytCoversData = [
//       {
//         title: data.firstTitle,
//         imgLinks: data.firstThumbnail,
//         id: 1,
//         link: data.firstUrl,
//       },
//       {
//         title: data.secondTitle,
//         imgLinks: data.secondThumbnail,
//         id: 2,
//         link: data.secondUrl,
//       },
//       {
//         title: data.thirdTitle,
//         imgLinks: data.thirdThumbnail,
//         id: 3,
//         link: data.thirdUrl,
//       },
//     ];

//     const ytContainer = document.getElementById("yt-container");

//     for (let coverItems of ytCoversData) {
//       ytContainer.innerHTML += `
//                <div class="col-lg-4 col-md-6 col-12 ytCovers-container">
//                    <a href="${coverItems.link}" target="_blank">
//                    <div class="ytCovers-img-container">
//                    <img src="${coverItems.imgLinks}" alt="">
//                    </div>
                           
//                              <p style="text-align: center;">${coverItems.title}</p>
//                    </a>
//                </div>`;
//     }
//   })
//   .catch((error) => console.error);

////////////import social media
const sociaMediaData = [
  {
    name: "Instagram",
    link: "https://www.instagram.com/sayeh_game/",
    imgLink: "/Images/social media icons/instagram.svg",
  },
  {
    name: "Discord",
    link: "https://discord.gg/rx8c29Q",
    imgLink: "/Images/social media icons/discord.svg",
  },
  {
    name: "Kick",
    link: "https://kick.com/sayeh",
    imgLink: "/Images/social media icons/kick.svg",
  },
  {
    name: "Telegram",
    link: "https://t.me/sayeh_game",
    imgLink: "/Images/social media icons/telegram.svg",
  },
  {
    name: "Youtube",
    link: "https://www.youtube.com/@Say3h",
    imgLink: "/Images/social media icons/youtube.svg",
  },
  {
    name: "Twitch",
    link: "https://www.twitch.tv/sayeh",
    imgLink: "/Images/social media icons/twitch.svg",
  },
];

const socialMediaContainer = document.getElementById("social-media-container");

for (let sMediaItem of sociaMediaData) {
  socialMediaContainer.innerHTML += ` 
    <a href="${sMediaItem.link}" target="_blank" id="social-media-cover"
    class="col-lg-3 col-md-4 col-sm-5 col-4 d-flex flex-column justify-content-center align-items-center">
          <img src="${sMediaItem.imgLink}" alt="${sMediaItem.name}-link ">
          <p>${sMediaItem.name}</p>
    </a>`;
}
////////////import support staff
const supportDonateData = [
  {
    name: "streamelements",
    link: "https://streamelements.com/sayeh/tip",
    imgLink: "/Images/support images/streamelements link.svg",
  },
  {
    name: "reymit",
    link: "https://reymit.ir/sayeh",
    imgLink: "/Images/support images/reymit link.svg",
  },
];

const supportSubData = [
  {
    name: "dono.gg",
    link: "https://sub.dono.gg/sayeh",
    imgLink: "/Images/support images/dono.gg sub link.svg",
  },
  {
    name: "reymitsub",
    link: "https://sub.reymit.ir/sayeh/",
    imgLink: "/Images/support images/reymit sub link.svg",
  },
];

const supportDonateContainer = document.getElementById("support-donate-link");

for (let donateItem of supportDonateData) {
  supportDonateContainer.innerHTML += ` 
    
         <div class="col-6">
              <a href="${donateItem.link}" target="_blank">
                 <img src="${donateItem.imgLink}" alt="${donateItem.name}}">
              </a>
         </div>
    `;
}
const supportSubContainer = document.getElementById("support-sub-link");

for (let subItem of supportSubData) {
  supportSubContainer.innerHTML += ` 
    
         <div class="col-6">
              <a href="${subItem.link}" target="_blank">
                 <img src="${subItem.imgLink}" alt="${subItem.name}}">
              </a>
         </div>
    `;
}
///////////footer
///footer logo
const footerLogoLink = document.getElementById("footer-logo-link");
footerLogoLink.href = "http://127.0.0.1:5500/index.html";
const footerLogoImg = document.createElement("img");
footerLogoImg.src = "/Images/logo footer.svg";
footerLogoImg.alt = "sayeh-logo-footer";
footerLogoImg.setAttribute("width", "140");
footerLogoImg.setAttribute("height", "100");
footerLogoLink.appendChild(footerLogoImg);
///footer social media
const footerSocialData = [
  {
    name: "Discord",
    imgLink: "/Images/footer socialmedia icons/discord.svg",
    srcLink: "https://discord.gg/rx8c29Q",
  },
  {
    name: "Instagram",
    imgLink: "/Images/footer socialmedia icons/instagram.svg",
    srcLink: "https:/www.instagram.com/sayeh_game",
  },
  {
    name: "Telegram",
    imgLink: "/Images/footer socialmedia icons/telegram.svg",
    srcLink: "https://t.me/sayeh_game",
  },
  {
    name: "Twitch",
    imgLink: "/Images/footer socialmedia icons/twitch.svg",
    srcLink: "https://www.twitch.tv/sayeh",
  },
  {
    name: "Kick",
    imgLink: "/Images/footer socialmedia icons/kick.svg",
    srcLink: "https://kick.com/sayeh",
  },
  {
    name: "Youtube",
    imgLink: "/Images/footer socialmedia icons/youtube.svg",
    srcLink: "https://www.youtube.com/@Say3h",
  },
];
const footerSocialUl = document.getElementById("footer-social-ul");
for (let footerSocialItems of footerSocialData) {
  footerSocialUl.innerHTML += `
     <li>
        <a target="_blank" href="${footerSocialItems.srcLink}"><img src="${footerSocialItems.imgLink}" width="20" height="20" 
        alt="${footerSocialItems.name}-footer-link"></a>
     </li>
       `;
}
///footer support
const footerSupportlData = [
  {
    name: "Reymit",
    srcLink: "https://reymit.ir/sayeh",
    dataEn: "Reymit",
    dataFa: "ریمیت",
  },
  {
    name: "Dono.gg",
    srcLink: "https://sub.dono.gg/sayeh",
    dataEn: "Dono.gg",
    dataFa: "دونو",
  },
  {
    name: "Streamelements",
    srcLink: "https://streamelements.com/sayeh/tip",
    dataEn: "Streamelements",
    dataFa: "استریم المنت",
  },
  {
    name: "Sub Reymit",
    srcLink: "https://sub.reymit.ir/sayeh/",
    dataEn: "Sub Reymit",
    dataFa: "ریمیت ساب",
  },
];
const footerSupportUl = document.getElementById("footer-support-ul");
for (let footerSupportItems of footerSupportlData) {
  footerSupportUl.innerHTML += `
     <li>
        <a target="_blank" data-en="${footerSupportItems.dataEn}" data-fa="${footerSupportItems.dataFa}"
        href="${footerSupportItems.srcLink}">${footerSupportItems.name}</a>
     </li>
       `;
}
///footer copyright

const copyRight = document.getElementById("copyRight");

const copyRightText = document.createElement("p");

const d = new Date();
const thisYear = d.getFullYear();
copyRightText.textContent = `© 2023-${thisYear} Sayeh Website All Rights Reserved`;
copyRight.appendChild(copyRightText);
/////rocket

const rocket = document.getElementById("rocket-scroll");

// const windowScrollHeight = window.scrollY;
// if (windowScrollHeight > 500) {
//     console.log("hi")
// }
window.addEventListener("scroll", function () {
  if (this.window.scrollY > 400) {
    rocket.style.display = "block";
  } else {
    rocket.style.display = "none";
  }
});
rocket.addEventListener("click", function (e) {
  e.preventDefault();
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});
/////////language
// const lang = {
//     fa: {
//         menu: ["درباره من", "توییچ", "یوتیوب", "شبکه های مجازی", "حمایت"],
//         titles: ["درباره من", "توییچ", "یوتیوب", "شبکه های مجازی", "حمایت"]
//     }
// }

// const langFaBtn = document.getElementById("lang-fa-icon");
// const langEnBtn = document.getElementById("lang-en-icon");

// const aboutTitle = document.getElementById("about-title");
// const aboutH1 = document.querySelector("#about-section h1");
// const title = document.querySelectorAll(".title");
// console.log(title)
// langFaBtn.addEventListener("click", function () {
//     title.forEach(function (items) {
//         items.innerHTML = `<i class="fa-regular fa-user mx-2"></i> ${lang.fa.titles[0]}`;
//         window.style.direction="rtl"
//     })
// });

// langEnBtn.addEventListener("click", function () {
//     aboutTitle.innerHTML = `<i class="fa-regular fa-user mx-2"></i> About`
// })