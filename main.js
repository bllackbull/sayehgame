///import logo navbar section
const leftNav = document.getElementById("left-nav");
const logoLink = document.createElement("a");
const logoImg = document.createElement("img");

logoLink.href = "https://iamblackbull.github.io";

logoImg.src = "/Images/logo footer.svg";
logoImg.width = "100";
logoImg.height = "70";
logoImg.alt = "sayeh-website-logo";

logoLink.appendChild(logoImg);
leftNav.appendChild(logoLink);

///import main menu navbar section
const menuItemsData = [
  { enText: "About Me", faText: "درباره من" },
  { enText: "Twitch", faText: "توییچ" },
  { enText: "YouTube", faText: "یوتیوب" },
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

///////////////////////////responsive navbar
const menuItemsResNav = [
  { enText: "About Me", faText: "درباره من" },
  { enText: "Twitch", faText: "توییچ" },
  { enText: "YouTube", faText: "یوتیوب" },
  { enText: "Social Media", faText: "شبکه های مجازی" },
  { enText: "Support", faText: "حمایت" },
];

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

const helloEN = "Hello Guys!";
const helloFA = "سلام بچه ها!";

hello.textContent = helloEN;
hello.setAttribute("data-fa", helloFA);
hello.setAttribute("data-en", helloEN);

const nameEN = "My name is Sayeh.";
const nameFA = "من سایه هستم.";

name.textContent = nameEN;
name.setAttribute("data-fa", nameFA);
name.setAttribute("data-en", nameEN);

const aboutMeEN = `I'm 32 years old and I live in tehran with my husband Hamid. I studied Microbiology and I play online games casualy when i'm not busy. I've been playing some indie games recently and I enjoyed them a lot.
I'm a Twitch partner and I've been streaming on Twitch for more than two years now. 
Sometimes I upload videos on YouTube. I strongly believe in creating a safe and inclusive environment for everyone in my chat.
I promotes respect, kindness and understanding among my viewers.`;
const aboutMeFA =
  "من 32 ساله هستم و با همسرم حمید در تهران زندگی میکنم. میکروبایولوژی خوندم و بازی آنلاین میکنم و اخیرا چند بازی مستقل بازی کردم که خیلی از آن ها لذت بردم. من پارتنر توییچ هستم و برای بیش از دو ساله که در توییچ استریم میکنم. گاهی اوقات در یوتیوب ویدیو آپلود میکنم. من شدیدا به ایجاد محیطی امن و فراگیر برای همه افراد در چت معتقد هستم. من احترام، مهربانی و تفاهم را در بین بینندگانم ترویج میکنم.";

content.textContent = aboutMeEN;
content.setAttribute("data-fa", aboutMeFA);
content.setAttribute("data-en", aboutMeEN);

aboutSection.append(hello, name, content);

///import favorites games about section
const favGames = document.getElementById("fav-games");
const favGamesTitle = document.createElement("p");

const favGameTitleEN = "These are the games I usually play in stream:";
const favGameTitleFA = "بازی هایی هستند که معمولا در استریم بازی میکنم:";

favGamesTitle.textContent = favGameTitleEN;
favGamesTitle.setAttribute("data-fa", favGameTitleFA);
favGamesTitle.setAttribute("data-en", favGameTitleEN);
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
    name: "YouTube",
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
footerLogoLink.href = "https://iamblackbull.github.io";
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
    name: "YouTube",
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
const copyright = document.getElementById("copyRight");

const copyrightText = document.createElement("p");

const d = new Date();
const thisYear = d.getFullYear();
copyrightText.textContent = `© 2023-${thisYear} Sayeh Website All Rights Reserved`;
copyright.appendChild(copyrightText);

/////rocket
const rocket = document.getElementById("rocket-scroll");

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
