import { getPeopleInfo, getPlanetInfo, getBothInfo, getApiInfo } from './getApi.js';
import { displayResults, displayPeopleDetails, displayPlanetDetails } from './displayInfo.js';
import { sendHistory, getStorage } from './storage.js';

const obiWanButton = document.querySelector("#obi-button");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const searchDropDown = document.querySelector(".dropdown-content");

let searchValue;
let searchQuery;


window.onload = function () {
  getStorage();
};

obiWanButton.addEventListener("click", () => {
  getObiWanApi();
});

searchInput.addEventListener("mousedown", () => {
  while (searchDropDown.hasChildNodes()) {
    searchDropDown.removeChild(searchDropDown.firstChild);
  }
});

searchButton.addEventListener("click", (event) => {
  if (searchInput.value !== "") {
    event.preventDefault();
    getSearchResult();
  }
});

function getObiWanApi() {
  const obiWanQuery = "10/";
  const obiWanUrl = `https://swapi.dev/api/people/${obiWanQuery}`;

  getApiInfo(obiWanUrl).then(data => {
    if (obiWanUrl.includes("people")) {
        displayPeopleDetails(data);
      }
      sendHistory(obiWanUrl, data);
  })
}

function getSearchResult() {
  searchValue = searchInput.value;
  searchQuery = `?search=${searchValue}`;

  const options = document.forms[0];

  if (options[0].checked && options[1].checked) {
    getBothInfo(searchQuery).then(results => {
        displayResults(results);
    });
  } else if (options[0].checked && !options[1].checked) {
    getPeopleInfo(searchQuery).then(results => {
        displayResults(results);
    });
  } else if (options[1].checked && !options[0].checked) {
    getPlanetInfo(searchQuery).then(results => {
        displayResults(results);
    });
  }
}

