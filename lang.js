const en = document.getElementById("lang-en-icon");
const fa = document.getElementById("lang-fa-icon");

const resEn = document.getElementById("lang-en-icon-res-nav");
const resFa = document.getElementById("lang-fa-icon-res-nav");

const aboutBorderFa = document.getElementById("about-section");

const copyright = document.getElementById("copyRight");

let lang = localStorage.getItem("lang");

if (lang === "en") {
  en.style.display = "none";
  fa.style.display = "block";
  resEn.style.display = "none";
  resFa.style.display = "block";

  document.body.style.direction = "ltr";

  aboutBorderFa.style.borderLeft = "4px solid #662D91";
  aboutBorderFa.style.borderRight = "none";

} else {
  en.style.display = "block";
  fa.style.display = "none";
  resEn.style.display = "block";
  resFa.style.display = "none";

  document.body.style.direction = "rtl";

  aboutBorderFa.style.borderRight = "4px solid #662D91";
  aboutBorderFa.style.borderLeft = "none";

  copyright.style.direction = "ltr";
}

en.addEventListener("click", function () {
  changelang("en");
  this.style.display = "none";
  fa.style.display = "block";
  resEn.style.display = "none";
  resFa.style.display = "block";

  document.body.style.direction = "ltr";

  aboutBorderFa.style.borderLeft = "4px solid #662D91";
  aboutBorderFa.style.borderRight = "none";
});
fa.addEventListener("click", function () {
  changelang("fa");
  en.style.display = "block";
  this.style.display = "none";
  resEn.style.display = "block";
  resFa.style.display = "none";

  document.body.style.direction = "rtl";

  aboutBorderFa.style.borderRight = "4px solid #662D91";
  aboutBorderFa.style.borderLeft = "none";

  copyright.style.direction = "ltr";
});
/////////////////
resEn.addEventListener("click", function () {
  changelang("en");
  en.style.display = "none";
  fa.style.display = "block";
  this.style.display = "none";
  resFa.style.display = "block";

  document.body.style.direction = "ltr";

  aboutBorderFa.style.borderLeft = "4px solid #662D91";
  aboutBorderFa.style.borderRight = "none";

});
resFa.addEventListener("click", function () {
  changelang("fa");
  en.style.display = "block";
  fa.style.display = "none";
  resEn.style.display = "block";
  this.style.display = "none";

  document.body.style.direction = "rtl";

  aboutBorderFa.style.borderRight = "4px solid #662D91";
  aboutBorderFa.style.borderLeft = "none";

  twitchBorderFa.style.borderRight = "4px solid #662D91";
  twitchBorderFa.style.borderLeft = "none";

  copyright.style.direction = "ltr";
});

if (lang) {
  changelang(lang);
} else {
  lang = document.documentElement.lang || "en";

  localStorage.setItem("lang", lang);
}

function changelang(lang) {
  document.documentElement.lang = lang;

  localStorage.setItem("lang", lang);

  let elements = document.documentElement.getElementsByTagName("*");

  for (var i = 0; i < elements.length; i++) {
    if (elements[i].getAttribute("data-" + lang)) {
      elements[i].innerHTML = elements[i].getAttribute("data-" + lang);
      elements[i].classList = "farsi-font";
    }
  }
}
