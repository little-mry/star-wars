import { getApiInfo } from './getApi.js';
import { sendHistory } from './storage.js';

const headerOutput = document.querySelector("#personname-header");
const planetHeader = document.querySelector("#planetname-header");
const searchDropDown = document.querySelector(".dropdown-content");
const searchInput = document.querySelector(".search-input");

export function displayResults(results) {
  if (results.length > 0) {
    results.forEach((item) => {
      let displayName = item.name;
      let searchResultUrl = item.url;

      const resultItem = document.createElement("a");
      resultItem.className = "result-item";
      resultItem.href = "#";
      resultItem.textContent = displayName;

      resultItem.addEventListener("click", async (event) => {
        event.preventDefault();
        console.log("searchResultUrl: " + searchResultUrl);

        const data = await getApiInfo(searchResultUrl);

        if (searchResultUrl.includes("people")) {
            displayPeopleDetails(data);
          } else if (searchResultUrl.includes("planets")) {
            displayPlanetDetails(data);
            document.querySelector(".table1").style.visibility = "collapse";
            document.querySelector("#character-header").style.visibility = "collapse";

          }
  
          while (searchDropDown.hasChildNodes()) {
            searchDropDown.removeChild(searchDropDown.firstChild);
          }
          sendHistory(searchResultUrl, data)
        });


      let suffixText = "";
      if (searchResultUrl.includes("people")) {
        suffixText = " (character)";
      } else if (searchResultUrl.includes("planet")) {
        suffixText = " (planet)";
      }

      searchDropDown.appendChild(resultItem);
      if (suffixText) {
        const suffixNode = document.createElement("span");
        suffixNode.textContent = suffixText;
        suffixNode.className = "suffix";
        resultItem.appendChild(suffixNode);
      }

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

export async function displayPeopleDetails(apiReturn) {
    console.log("Visa karaktärsdetaljer:", apiReturn); // Lägg till denna rad för att se vilken data som visas

  headerOutput.innerText = apiReturn.name;


  document.querySelectorAll(".strings").forEach((element) => {
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
  document.querySelector("#personname-header").style.visibility = "visible";
  document.querySelector(".table1").style.visibility = "visible";
  document.querySelector(".galaxy-map").style.visibility = "collapse";
}

export function displayPlanetDetails(apiReturn) {
  planetHeader.innerText = apiReturn.name;

  document.querySelectorAll(".strings").forEach((element) => {
    const id = element.id;
    if (apiReturn[id]) {
      element.textContent = apiReturn[id];
    }
  });    

  if (apiReturn.name) {
    document.querySelector("#planet-name").textContent = apiReturn.name;
  }
  document.querySelector("#character-header").style.visibility = "collapse";
  document.querySelector("#personname-header").style.visibility = "collapse";
  document.querySelector("#planet-header").style.visibility = "visible";
  document.querySelector(".table2").style.visibility = "visible";
  document.querySelector(".galaxy-map").style.visibility = "visible";
}
