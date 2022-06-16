let header = document.querySelector("header");

window.addEventListener("scroll", checkHeaderPosition);

function checkHeaderPosition() {
  if (window.scrollY >= 1000) {
    header.classList.add("fixed");
  } else {
    header.classList.remove("fixed");
  }
}

let menuWrappers = Array.from(document.querySelectorAll(".menu-wrapper"));

menuWrappers.forEach((wrapper) => {
  wrapper.addEventListener("click", function () {
    this.classList.toggle("active");
    this.nextElementSibling.classList.toggle("active");
  });
  wrapper.addEventListener("blur", function () {
    this.classList.remove("active");
    this.nextElementSibling.classList.remove("active");
  });
});

let featBoxs = document.querySelectorAll(".features .info .feat");
let featuresMettingSection = document.querySelector(".features-meetings");

function fixFeatures() {
  let boxHeight = featBoxs[0].getBoundingClientRect().width;
  featuresMettingSection.style.paddingTop = `${boxHeight / 2}px`;
}
fixFeatures();
window.onresize = fixFeatures;

let sliders = document.querySelectorAll(".slider");
let slideBtns = document.querySelectorAll(".slider .btn");
let touchStarted = false;
let starterPosition = 0;
let totalAmount = 0;
let amountScrolled = 0;
let counters = {};

for (let i = 0; i < sliders.length; i++) {
  counters[i] = 0;
  let boxWidth = sliders[i].lastElementChild.getBoundingClientRect().width;
  let clonedBoxs = sliders[i].querySelectorAll(".box.cloned");
  fixSlider(sliders[i], clonedBoxs.length, i);
  window.addEventListener("resize", () =>
    fixSlider(sliders[i], clonedBoxs.length, i)
  );
}

function fixSlider(slider, clonedLength, sliderIndex) {
  let boxWidth = slider.lastElementChild.getBoundingClientRect().width;
  slider.scrollTo({
    top: 0,
    left:
      (boxWidth + 30) * (clonedLength / 2) +
      (boxWidth + 30) * counters[sliderIndex],
  });
}

slideBtns.forEach((btn) => {
  let slider = btn.parentElement;
  let sliderBoxs = slider.querySelectorAll(".box");
  let clonedBoxs = slider.querySelectorAll(".box.cloned");
  btn.addEventListener("click", () => {
    let boxWidth = slider.lastElementChild.getBoundingClientRect().width;
    if (btn.classList.contains("next")) {
      slideNext(slider, sliderBoxs, clonedBoxs, boxWidth);
    } else {
      slidePrev(slider, sliderBoxs, clonedBoxs);
    }
  });
});

function slideNext(slider, sliderBoxs, clonedBoxs, boxWidth) {
  let i = parseInt(slider.dataset.index);
  if (counters[i] !== sliderBoxs.length - clonedBoxs.length) {
    counters[i]++;
    scrollSlider(slider, clonedBoxs.length, counters[i], "smooth");
  }
  if (counters[i] === sliderBoxs.length - clonedBoxs.length) {
    let waiter = setInterval(() => {
      if (
        Math.round(slider.scrollLeft) ===
          Math.round(
            (boxWidth + 30) * (sliderBoxs.length - clonedBoxs.length / 2)
          ) ||
        Math.round(slider.scrollLeft) -
          Math.round(
            (boxWidth + 30) * (sliderBoxs.length - clonedBoxs.length / 2)
          ) ===
          1 ||
        Math.round(
          (boxWidth + 30) * (sliderBoxs.length - clonedBoxs.length / 2)
        ) -
          Math.round(slider.scrollLeft) ===
          1
      ) {
        counters[i] = 0;
        scrollSlider(slider, clonedBoxs.length, counters[i], "auto");
        if (i === 1) {
          checkBulletsActivity(slider);
        }
        clearInterval(waiter);
      }
    }, 1);
  }
}

function slidePrev(slider, sliderBoxs, clonedBoxs) {
  let i = parseInt(slider.dataset.index);
  if (counters[i] !== -(clonedBoxs.length / 2)) {
    counters[i]--;
    scrollSlider(slider, clonedBoxs.length, counters[i], "smooth");
  }
  if (counters[i] === -(clonedBoxs.length / 2)) {
    let waiter = setInterval(() => {
      if (slider.scrollLeft === 0) {
        counters[i] =
          sliderBoxs.length - clonedBoxs.length - clonedBoxs.length / 2;
        scrollSlider(slider, clonedBoxs.length, counters[i], "auto");
        if (i === 1) {
          checkBulletsActivity(slider);
        }
        clearInterval(waiter);
      }
    }, 1);
  }
}

function scrollSlider(slider, clonedLength, counter, behavior) {
  let boxWidth = slider.lastElementChild.getBoundingClientRect().width;
  console.log((boxWidth + 30) * (clonedLength / 2) + (boxWidth + 30) * counter)
  slider.scrollTo({
    top: 0,
    left: (boxWidth + 30) * (clonedLength / 2) + (boxWidth + 30) * counter,
    behavior: behavior,
  });
}

// Make bullets

let sliderTarget = document.querySelector(".courses .slider");
let bullets = document.querySelector(".courses .bullets");
let sliderTargetBoxWidth =
  sliderTarget.lastElementChild.getBoundingClientRect().width;

addBullets(sliderTarget, sliderTargetBoxWidth, bullets);
window.addEventListener("resize", () => {
  if (bullets.children.length >= 1) {
    let bulletsLength = bullets.children.length;
    for (let i = 0; i < bulletsLength; i++) {
      bullets.firstElementChild.remove();
    }
  }
  let sliderTargetBoxWidth =
    sliderTarget.lastElementChild.getBoundingClientRect().width;
  addBullets(sliderTarget, sliderTargetBoxWidth, bullets);
  handleBulletsClicked();
  checkBulletsActivity(sliderTarget);
});

handleBulletsClicked();
function handleBulletsClicked() {
  Array.from(bullets.children).forEach((bullet) => {
    bullet.addEventListener("click", () => {
      bulletClicked(sliderTarget, bullet);
      checkBulletsActivity(sliderTarget);
    });
  });
}
Array.from(sliderTarget.querySelectorAll(".btn")).forEach((btn) => {
  btn.addEventListener("click", () => {
    checkBulletsActivity(sliderTarget);
  });
});

function addBullets(slider, boxWidth, bullets) {
  let boxsNotCloned = slider.querySelectorAll(".box:not(.cloned)");
  let boxsNumber = Math.round(
    parseInt(window.getComputedStyle(slider).width) / boxWidth
  );
  let bulletsNumber = boxsNotCloned.length / boxsNumber;
  for (let i = 0; i < bulletsNumber; i++) {
    let bullet = document.createElement("div");
    bullet.className = "bullet";
    bullet.setAttribute("data-index", boxsNumber * i);
    bullets.appendChild(bullet);
  }
  checkBulletsActivity(sliderTarget);
}

function bulletClicked(slider, bullet) {
  let clonedBoxs = slider.querySelectorAll(".box.cloned");
  let sliderIndex = slider.dataset.index;
  counters[sliderIndex] = bullet.dataset.index;
  scrollSlider(slider, clonedBoxs.length, counters[sliderIndex], "smooth");
}
function checkBulletsActivity(slider) {
  let bullets = slider.nextElementSibling;
  let sliderIndex = slider.dataset.index;
  let counter = counters[sliderIndex];
  Array.from(bullets.children).forEach((bullet) => {
    try {
      if (
        counter >= parseInt(bullet.dataset.index) &&
        counter < parseInt(bullet.nextElementSibling.dataset.index)
      ) {
        Array.from(bullets.children).forEach((bullet) => {
          bullet.classList.remove("active");
        });
        bullet.classList.add("active");
      }
    } catch {
      Array.from(bullets.children).forEach((bullet) => {
        bullet.classList.remove("active");
      });
      bullet.classList.add("active");
    }
  });
}

// Dropdown Info

let infoOpenerClass = ".apply-now .dropdown-info .info-head";

$(document).ready(function () {
  $(infoOpenerClass).click(function () {
    for (let i = 0; i < $(infoOpenerClass).length; i++) {
      if ($(infoOpenerClass)[i].innerHTML == $(this).html()) {
        continue;
      }
      $($(infoOpenerClass)[i]).removeClass("active");
      $($(infoOpenerClass)[i].nextElementSibling).slideUp();
    }
    $(this).addClass("active");
    $(this).next().slideDown();
  });
});

// Increament Stas On Scroll

let statsNumsBox = document.querySelector(".stats .info .boxs");
let statsNums = document.querySelectorAll(".stats .number");
let started = false;

checkPosition(statsNumsBox);

window.addEventListener("scroll", () => {
  checkPosition(statsNumsBox);
});

function checkPosition(targetSection) {
  if (
    targetSection.getBoundingClientRect().top <= window.innerHeight &&
    !started
  ) {
    increamentNums(statsNums);
  }
}

function increamentNums(nodeListOfNums) {
  started = true;
  nodeListOfNums.forEach((nodeNum, index) => {
    let increament = (function (nodeNum) {
      let prevIncreamentTime = 0;
      console.log(nodeNum);
      const target = parseInt(nodeNum.dataset.tar);
      return function (duration) {
        endIncreament(increamenter);
        if (duration - prevIncreamentTime >= 1e3 / target) {
          prevIncreamentTime = duration;
          nodeNum.innerHTML++;
        }
        if (nodeNum.innerHTML >= target) {
          endIncreament(increamenter);
          return;
        }
        requestAnimationFrame(increament);
      };
    })(nodeNum);
    let increamenter = requestAnimationFrame(increament);
    function endIncreament(identifier) {
      cancelAnimationFrame(identifier);
    }
  });
}
// Add * To Required Unput Fields

let requiredFields = document.querySelectorAll("form *[required]");

requiredFields.forEach((field) => {
  let placeHolder = field.getAttribute("placeholder");
  if (placeHolder) {
    field.setAttribute("placeholder", placeHolder + "*");
  }
});
