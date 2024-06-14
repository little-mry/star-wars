const peopleUrl = "https://swapi.dev/api/people/";
const planetsUrl = "https://swapi.dev/api/planets/";
const obiWanButton = document.querySelector("#obi-button");
const headerOutput = document.querySelector("#personname-header");
const planetHeader = document.querySelector("#planetname-header");

const factOutput = document.querySelector(".info-container");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const searchDropDown = document.querySelector(".dropdown-content");
const infoStrings = document.querySelectorAll(".strings");
const checkBoxes = document.querySelectorAll(".checkbox input");
const recentSearches = document.querySelector(".recent-searches")

let infoDiv = "";
let apiUrl;
let searchValue;
let searchQuery;

obiWanButton.addEventListener("click", () => {
  getObiWanApi();
});

searchInput.addEventListener("mousedown", () => {
  while (searchDropDown.hasChildNodes()) {
    searchDropDown.removeChild(searchDropDown.firstChild);
  }
});

searchButton.addEventListener("click", async (event) => {
  if (searchInput.value !== "") {
    event.preventDefault();
    await getSearchResult();
  }
});

function getObiWanApi() {
  const obiWanQuery = "10/";
  const obiWanUrl = peopleUrl + obiWanQuery;
  console.log(obiWanUrl);

  getApiInfo(obiWanUrl);
}

function getSearchResult() {
  searchValue = searchInput.value;
  searchQuery = "?search=" + searchValue;

  const selectedOption = document.querySelector(
    'input[name="search-options"]:checked'
  ).value;
  console.log("Selected search option:", selectedOption);

  if (selectedOption === "People") {
    getPeopleInfo();
  } else if (selectedOption === "Planets") {
    getPlanetInfo();
  } else if (selectedOption === "Both") {
    getBothInfo();
  }

  searchInput.value = "";
}

async function getPeopleInfo() {
  apiUrl = peopleUrl + searchQuery;

  const searchResponse = await fetch(apiUrl);
  const data = await searchResponse.json();

  displayResults(data.results);
}

async function getPlanetInfo() {
  apiUrl = planetsUrl + searchQuery;

  const searchResponse = await fetch(apiUrl);
  const data = await searchResponse.json();

  displayResults(data.results);
}

async function getBothInfo() {
  const [peopleResponse, planetsResponse] = await Promise.all([
    fetch(peopleUrl + searchQuery),
    fetch(planetsUrl + searchQuery),
  ]);

  const [peopleInfo, planetsInfo] = await Promise.all([
    peopleResponse.json(),
    planetsResponse.json(),
  ]);

  const combinedResults = [...peopleInfo.results, ...planetsInfo.results];
  displayResults(combinedResults);
}

function displayResults(results) {
  if (results.length > 0) {
    results.forEach((item) => {
      let displayName = item.name;
      let searchResultUrl = item.url;

      const resultItem = document.createElement("a");
      resultItem.className = "result-item";
      resultItem.href = "#";
      resultItem.textContent = displayName;


      resultItem.addEventListener("click", (event) => {
        event.preventDefault();
        console.log('searchResultUrl: ' + searchResultUrl)
        getApiInfo(searchResultUrl);

        while (searchDropDown.hasChildNodes()) {
          searchDropDown.removeChild(searchDropDown.firstChild);
        }
      });

      searchDropDown.appendChild(resultItem);
      searchInput.value = "";
    });
  } else {
    const noResults = document.createElement("p");
    noResults.textContent =
      "Couldn't find anything that contains \"" +
      searchInput.value +
      '", try again...';
    searchDropDown.appendChild(noResults);
    searchInput.value = "";
  }
}

async function getApiInfo(url) {
  const response = await fetch(url);
  const apiReturn = await response.json();

  if (apiReturn.url.includes("people")) {
    displayPeopleDetails(apiReturn);
  } else if (apiReturn.url.includes("planets")) {
    displayPlanetDetails(apiReturn);
    document.querySelector(".table1").style.visibility = "collapse";
    document.querySelector("#character-header").style.visibility = "collapse";

    headerOutput.innerText = "";
  }

  sendHistory(url, apiReturn)
}

async function displayPeopleDetails(apiReturn) {
  headerOutput.innerText = apiReturn.name;

  infoStrings.forEach((element) => {
    const id = element.id;
    if (apiReturn[id]) {
      element.textContent = apiReturn[id];
    }
  });

  if (apiReturn.name) {
    document.querySelector("#person-name").textContent = apiReturn.name;
  }

  if (apiReturn.homeworld) {
    const homeworldResponse = await fetch(apiReturn.homeworld);
    const homeworldData = await homeworldResponse.json();
    document.querySelector("#homeworld").textContent = homeworldData.name;

    displayPlanetDetails(homeworldData);
  }

  document.querySelector("#character-header").style.visibility = "visible";
  document.querySelector(".table1").style.visibility = "visible";
  document.querySelector(".galaxy-map").style.visibility = "collapse";
}

function displayPlanetDetails(apiReturn) {
  planetHeader.innerText = apiReturn.name;

  infoStrings.forEach((element) => {
    const id = element.id;
    if (apiReturn[id]) {
      element.textContent = apiReturn[id];
    }
  });

  if (apiReturn.name) {
    document.querySelector("#planet-name").textContent = apiReturn.name;
  }

  document.querySelector("#planet-header").style.visibility = "visible";
  document.querySelector(".table2").style.visibility = "visible";
  document.querySelector(".galaxy-map").style.visibility = "visible";
}

function sendHistory(url, apiReturn) {
  const historyItems = document.createElement("span");
  historyItems.className = 'history-item'

  const reloadBtn = document.createElement("button");
  reloadBtn.className = 'reload-btn'
  reloadBtn.addEventListener('click', () => {
    getApiInfo(url)
  })

  const getIcon = document.createElement("img");
  getIcon.src = 'img/reload1.png';
  getIcon.alt = 'reload icon';
  getIcon.className = 'reload-icon';



  historyItems.appendChild(reloadBtn);
  reloadBtn.appendChild(getIcon);
  historyItems.appendChild(document.createTextNode(apiReturn.name))
  recentSearches.insertBefore(historyItems, recentSearches.children[0])
}

function storeLocally() {}

function getStorage() {}
