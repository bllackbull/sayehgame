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
