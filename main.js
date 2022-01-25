"use strict";

// Make navbar transparent when it is on the top
const navbar = document.querySelector("#navbar");
const navbarHeight = navbar.getBoundingClientRect().height;

document.addEventListener("scroll", () => {
  if (window.scrollY > navbarHeight) {
    navbar.classList.add("navbar--dark");
  } else {
    navbar.classList.remove("navbar--dark");
  }
});

// Handle scrolling when tapping on the navbar menu
const navbarMenu = document.querySelector(".navbar__menu");
navbarMenu.addEventListener("click", (event) => {
  const target = event.target;
  const link = target.dataset.link;
  if (link == null) {
    return; // 빈 곳 클릭 시 넘기기.
  }
  navbarMenu.classList.remove("open");
  scrollIntoView(link);
});

// Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector(".navbar__toggle-btn");
navbarToggleBtn.addEventListener("click", () => {
  navbarMenu.classList.toggle("open");
});

// Handle click on "Contact me" button on home
const homeContactBtn = document.querySelector(".home__contact");
homeContactBtn.addEventListener("click", () => {
  scrollIntoView("#contact");
});

// Make home slowly fade to transparent as the window scrolls down
const home = document.querySelector(".home__container");
const homeHeight = home.getBoundingClientRect().height;

document.addEventListener("scroll", () => {
  home.style.opacity = 1 - window.scrollY / homeHeight;
});

// Show "arrow-up" button when scrolling down
const arrowUp = document.querySelector(".arrow-up");
document.addEventListener("scroll", () => {
  if (window.scrollY > homeHeight / 2) {
    arrowUp.classList.add("visible");
  } else {
    arrowUp.classList.remove("visible");
  }
});

// Handle click on the "arrow-up" button
arrowUp.addEventListener("click", () => {
  scrollIntoView("#home");
});

// Projects filtering
const workBtnContainer = document.querySelector(".work__categories");
const projectContainer = document.querySelector(".work__projects");
const projects = document.querySelectorAll(".project");

workBtnContainer.addEventListener("click", (e) => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  if (filter == null) {
    return;
  }
  // Remove selection from the previous item and select the new one
  const active = document.querySelector(".category__btn.selected");
  active.classList.remove("selected");
  // 클릭된 target의 nodeName(이름)이 "BUTTON"이면, e.target(category__btn)을 쓰고, 아니면, e.target.parentNode(category__count인 span)을 쓴다는 가정하에
  const target =
    e.target.nodeName === "BUTTON" ? e.target : e.target.parentNode;
  target.classList.add("selected");

  // Projects animation
  projectContainer.classList.add("anim-out");
  setTimeout(() => {
    projects.forEach((project) => {
      if (filter === "*" || filter === project.dataset.type) {
        project.classList.remove("invisible");
      } else {
        project.classList.add("invisible");
      }
    });
    projectContainer.classList.remove("anim-out");
  }, 300);
});

// < 스크롤 시 메뉴 활성화하기 >

// 1. 모든 섹션 요소들과 메뉴 아이템들을 가지고 온다.
const sectionIds = [
  "#home",
  "#about",
  "#skills",
  "#work",
  "#testimonials",
  "#contact",
];

const sections = sectionIds.map((id) => document.querySelector(id));
const navItems = sectionIds.map((id) =>
  document.querySelector(`[data-link="${id}"]`)
);

// 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다.

let selectedNavIndex = 0; // 현재 선택된 메뉴 인덱스 설정
let selectedNavItem = navItems[0]; // 현재 선택된 첫번재 메뉴 아이템 설정

// 새로운 메뉴 아이템을 선택할 때마다 이전에 활성화된 아이를 지워주고, 다시 새롭게 할당하고 나서 active를 지정함.
function selectNavItem(selected) {
  selectedNavItem.classList.remove("active");
  selectedNavItem = selected;
  selectedNavItem.classList.add("active");
}

// selector마다 같은 실행을 할 수 있도록 묶기.
function scrollIntoView(selector) {
  const scrollToSection = document.querySelector(selector);
  scrollToSection.scrollIntoView({ behavior: "smooth" });
  selectNavItem(navItems[sectionIds.indexOf(selector)]); // Contact me, Arrow-up버튼 클릭시 활성화 처리.
}

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.3,
};

// 3, 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다.
const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    // 만약, 빠져나갈 때, + intersectionRatio가 0이상이어야 할 때,
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      // 섹션의 방향 설정
      // entry.boundClientRect.y가 (-) : 스크롤링이 아래로 되어서 페이지가 올라옴
      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1; // 위에 있는 섹션이 위로 빠져나가는 경우, y값이 (-)
      } else {
        selectedNavIndex = index - 1; // 아래에 있는 섹션이 밑으로 빠져나가는 경우, y값이 (+)
      }
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach((section) => observer.observe(section));

// 4. 스크롤링이 될 때마다 해당하는 메뉴를 선택한다.
// 브라우저에서 모든 스크롤이 해당하는 이벤트는 'scroll'이지만, (메뉴 클릭했을 때 이용)
// 사용자가 스스로 스크롤링 할 때, 'wheel' 이벤트 사용. (마우스나 트랙패드 이용)
window.addEventListener("wheel", () => {
  if (window.scrollY === 0) {
    selectedNavIndex = 0; // 제일 위에 위치.
  } else if (
    Math.round(window.scrollY + window.innerHeight) >=
    document.body.scrollHeight
  ) {
    selectedNavIndex = navItems.length - 1; // 제일 아래에 위치.
  }
  selectNavItem(navItems[selectedNavIndex]); // 중간에 위치.
});
