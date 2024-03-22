"use strict";

const contentsContainer = document.querySelector(".contents");
console.log(contentsContainer);

const renderListings = async () => {
  let url = "data/db.json";
  let res = await fetch(url);
  let lists = await res.json();
  console.log(lists);

  let template = "";
  lists.forEach((list, i) => {
    template += `
    <div class="content">
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
};

window.addEventListener("DOMContentLoaded", () => renderListings());
