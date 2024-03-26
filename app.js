"use strict";

const contentsContainer = document.querySelector(".contents");
let jobs;
let buttonsContainer;
const url = "data/db.json";

const alertUser = function (params) {
  alert(params);
};

const handleCreateElement = function (name, element, className, text) {
  name = document.createElement(element);
  name.classList.add(className);
  name.textContent = text;
  return name;
};

const handleAppendElement = function (appender, appendee) {
  appender.appendChild(appendee);
};

const handleFilterByRole_Level = function (passedJobs, categoryPassed) {
  passedJobs.forEach((job) => {
    const jobLanguage = job.getAttribute("data-languages").split(",");
    const jobtools = job.getAttribute("data-tools").split(",");

    if (
      job.getAttribute(`data-role`) === categoryPassed ||
      job.getAttribute(`data-level`) === categoryPassed ||
      jobLanguage.includes(categoryPassed) ||
      jobtools.includes(categoryPassed)
    ) {
      job.style.display = "flex";
    } else {
      job.style.display = "None";
    }
  });
};

const renderListings = async () => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `Could not connect to Server. Please refresh the page and try again`
      );
    }
    const lists = await res.json();

    let template = "";
    lists.forEach((list, i) => {
      template += `
    <div class="content" data-role=${list.role} data-level=${list.level
        } data-languages=${list.languages} data-tools=${list.tools}>
    <div class="left">
      <div class="image">
        <img src="${list.logo}" alt="${list.company}" />
      </div>
      <div class="detail">
        <div class="top">
          <p class="photosnap">${list.company}</p>
          ${list.new ? "<p class='new-tag'>NEW!</p>" : ""}
          ${list.featured ? "<p class='featured-tag'>FEATURED</p>" : ""}
        </div>
        <div class="middle">${list.position}</div>
        <div class="bottom">
          <p><span>${list.postedAt}</span>
            <span>.</span>
            <span>${list.contract}</span> 
            <span>.</span>
            <span>${list.location}</span>
           </p>
        </div>
      </div>
    </div>
    <div class="right">
      <p class='categories'>${list.role}</p>
      <p class='categories'>${list.level}</p>
      ${list.languages
          .map((language) => `<p class='categories'>${language}</p>`)
          .join(" ")}

      ${list.tools.map((tool) => `<p class='categories'>${tool}</p>`).join(" ")}

    </div>

  </div>
    `;
    });

    contentsContainer.innerHTML = template;
    jobs = document.querySelectorAll(".content");
    buttonsContainer = document.querySelectorAll(".right");
  } catch (error) {
    alertUser(error);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  renderListings().then(() => {
    const tabOverall = handleCreateElement("tabOverall", "div", "tabover");
    const tabcont = handleCreateElement("tabcont", "div", "tabcont");
    const tabClear = handleCreateElement("tabClear", "p", "tabclear", "Clear");
    handleAppendElement(tabOverall, tabcont);
    handleAppendElement(tabOverall, tabClear);
    buttonsContainer.forEach((cont) => {
      cont.addEventListener("click", (e) => {
        if (e.target.classList.contains("categories")) {
          let category = e.target.textContent.trim();
          console.log(category);
          handleFilterByRole_Level(jobs, category);
          e.target.classList.add("active");
        }
        if (e.target.classList.contains("active")) {
          let category = e.target.textContent.trim();
          // Check if tab already exists for the selected category
          if (!tabcont.querySelector(`.tab[data-category="${category}"]`)) {
            const tab = handleCreateElement("tab", "p", "tab");
            console.log(tab);
            tab.innerHTML = `${category} <span class='tab-span'>&times</span>`;
            tab.setAttribute("data-category", category);
            handleAppendElement(tabcont, tab);
            contentsContainer.prepend(tabOverall);
          }
        }
      });
    });

    tabcont.addEventListener("click", (e) => {
      if (e.target.classList.contains("tab-span")) {
        const tab = e.target.parentElement;
        const category = tab.getAttribute("data-category");
        tab.remove();

        jobs.forEach((job) => {
          job.style.display = "flex";
        });

        document.querySelectorAll(".tab").forEach((tab) => {
          const category = tab.getAttribute("data-category");
          jobs.forEach((job) => {
            const role = job.getAttribute("data-role");
            const level = job.getAttribute("data-level");
            if (role !== category && level !== category) {
              job.style.display = "none";
            }
          });
        });
      }
    });

    tabOverall.addEventListener("click", (e) => {
      if (e.target.classList.contains("tabclear")) {
        const tab = tabcont.querySelectorAll(".tab");
        tab.forEach((tab) => {
          tab.remove();
          tabOverall.remove();
        });
        jobs.forEach((job) => {
          job.style.display = "flex";
        });
      }
    });
  });
});
