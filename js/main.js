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

// Fix Features Section

let featBoxs = document.querySelectorAll(".features .info .feat");
let featuresMettingSection = document.querySelector(".features-meetings");

function fixFeatures() {
  let boxHeight = featBoxs[0].getBoundingClientRect().width;
  featuresMettingSection.style.paddingTop = `${boxHeight / 2}px`;
}
fixFeatures();
window.onresize = fixFeatures;

// Make Sliders

let sliders = document.querySelectorAll(".slider");
let slideBtns = document.querySelectorAll(".btns-container .btn");
let counters = {};
let prevTime = 0;
let starterPosition = 0;
let touchStarted = false;
let amountScrolled = 0;

for (let i = 0; i < sliders.length; i++) {
  counters[i] = 0;
  let clonedBoxs = sliders[i].querySelectorAll(".box.cloned");
  let sliderBoxs = sliders[i].querySelectorAll(".box");
  let boxWidth = sliders[i].lastElementChild.getBoundingClientRect().width;
  fixSlider(sliders[i], clonedBoxs.length, i);
  window.addEventListener("resize", () =>
    fixSlider(sliders[i], clonedBoxs.length, i)
  );
  requestAnimationFrame(
    slideAfterDelay(sliders[i], sliderBoxs, clonedBoxs, boxWidth)
  );

  // Handle Touch Events
  sliders[i].ontouchstart = (e) => {
    let touch = e.changedTouches[0];
    starterPosition = touch.screenX;
    touchStarted = true;
    sliders[i].style.cursor = "grabbing";
  };
  sliders[i].ontouchmove = (e) => {
    if (touchStarted) {
      let touch = e.changedTouches[0];
      amountScrolled = touch.screenX - starterPosition;
      touchMove(sliders[i], counters[i], amountScrolled, clonedBoxs, boxWidth);
    }
  };
  sliders[i].ontouchend = () => {
    touchEnd(sliders[i], amountScrolled, clonedBoxs, boxWidth, sliderBoxs, i);
  };

  // Handle Mouse Events
  sliders[i].onmousedown = (e) => {
    starterPosition = e.screenX;
    touchStarted = true;
    sliders[i].style.cursor = "grabbing";
  };
  sliders[i].onmousemove = (e) => {
    if (touchStarted) {
      sliders[i].style.cursor = "grabbing";
      amountScrolled = e.screenX - starterPosition;
      touchMove(sliders[i], counters[i], amountScrolled, clonedBoxs, boxWidth);
    }
  };
  sliders[i].onmouseup = () => {
    touchEnd(sliders[i], amountScrolled, clonedBoxs, boxWidth, sliderBoxs, i);
  };
}

function touchMove(slider, counter, amountScrolled, clonedBoxs, boxWidth) {
  let clonedLength = clonedBoxs.length;
  slider.style.transition = "150ms";
  slider.style.transform = `translateX(-${
    (boxWidth + 30) * (clonedLength / 2) +
    (boxWidth + 30) * counter -
    amountScrolled
  }px)`;
}

function touchEnd(
  slider,
  amountScrolled,
  clonedBoxs,
  boxWidth,
  sliderBoxs,
  sliderIndex
) {
  touchStarted = false;
  sliders[sliderIndex].style.cursor = "grab";
  let boxsScrolled = Math.round(amountScrolled / boxWidth);
  if (boxsScrolled) {}
  if (boxsScrolled === 0) {
    counters[sliderIndex]++;
    slidePrev(slider, sliderBoxs, clonedBoxs)
  } else if (boxsScrolled <= 0) {
    slideNext(slider, sliderBoxs, clonedBoxs)
  } else if (boxsScrolled >= 0) {
    slidePrev(slider, sliderBoxs, clonedBoxs)
  }
}

function slideAfterDelay(slider, sliderBoxs, clonedBoxs) {
  let sliderIndex = slider.dataset.index;
  return function (timestamp) {
    if (timestamp - prevTime >= 6000) {
      slideNext(slider, sliderBoxs, clonedBoxs);
      if (sliderIndex == sliders.length - 1) {
        prevTime = timestamp;
      }
    }
    requestAnimationFrame(slideAfterDelay(slider, sliderBoxs, clonedBoxs));
  };
}

function fixSlider(slider, clonedLength, sliderIndex) {
  let boxWidth = slider.lastElementChild.getBoundingClientRect().width;
  slider.style.transition = "0s";
  slider.style.transform = `translateX(-${
    (boxWidth + 30) * (clonedLength / 2) +
    (boxWidth + 30) * counters[sliderIndex]
  }px)`;
}

slideBtns.forEach((btn) => {
  let slider = btn.parentElement.querySelector(".slider");
  let sliderBoxs = slider.querySelectorAll(".box");
  let clonedBoxs = slider.querySelectorAll(".box.cloned");
  btn.addEventListener("click", () => {
    let boxWidth = slider.lastElementChild.getBoundingClientRect().width;
    if (btn.classList.contains("next")) {
      slideNext(slider, sliderBoxs, clonedBoxs);
    } else {
      slidePrev(slider, sliderBoxs, clonedBoxs);
    }
  });
});

function slideNext(slider, sliderBoxs, clonedBoxs) {
  let i = parseInt(slider.dataset.index);
  if (counters[i] !== sliderBoxs.length - clonedBoxs.length) {
    slider.ontransitionend = () => {
      return;
    };
    counters[i]++;
    scrollSlider(slider, clonedBoxs.length, counters[i], "0.3s");
  }
  if (counters[i] === sliderBoxs.length - clonedBoxs.length) {
    slider.ontransitionend = () => {
      counters[i] = 0;
      scrollSlider(slider, clonedBoxs.length, counters[i], "0s");
      return;
    };
  }
}

function slidePrev(slider, sliderBoxs, clonedBoxs) {
  let i = parseInt(slider.dataset.index);
  if (counters[i] !== -(clonedBoxs.length / 2)) {
    slider.ontransitionend = () => {
      return;
    };
    counters[i]--;
    scrollSlider(slider, clonedBoxs.length, counters[i], "0.3s");
  }
  if (counters[i] === -(clonedBoxs.length / 2)) {
    slider.ontransitionend = () => {
      counters[i] =
        sliderBoxs.length - clonedBoxs.length - clonedBoxs.length / 2;
      scrollSlider(slider, clonedBoxs.length, counters[i], "0s");
    };
  }
}

function scrollSlider(slider, clonedLength, counter, transition) {
  slider.style.transition = transition;
  let boxWidth = slider.lastElementChild.getBoundingClientRect().width;
  slider.style.transform = `translateX(-${
    (boxWidth + 30) * (clonedLength / 2) + (boxWidth + 30) * counter
  }px)`;
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
});

sliderTarget.addEventListener("transitionend", () => {
  checkBulletsActivity(sliderTarget);
});

handleBulletsClicked();
function handleBulletsClicked() {
  Array.from(bullets.children).forEach((bullet) => {
    bullet.addEventListener("click", () => {
      bulletClicked(sliderTarget, bullet);
    });
  });
}

Array.from(
  sliderTarget.parentElement.parentElement.querySelectorAll(".btn")
).forEach((btn) => {
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
  scrollSlider(slider, clonedBoxs.length, counters[sliderIndex], "0.3s");
  checkBulletsActivity(slider);
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
