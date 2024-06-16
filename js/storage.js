import { getApiInfo } from './getApi.js';
import { displayPeopleDetails, displayPlanetDetails } from './displayInfo.js';

const recentSearches = document.querySelector(".recent-searches")

export function sendHistory(url, apiReturn) {
    const historyItems = document.createElement("span");
    historyItems.className = 'history-item'
  
    const reloadBtn = document.createElement("button");
    reloadBtn.className = 'reload-btn'
        reloadBtn.addEventListener('click', () => {
        getApiInfo(url).then(data => {
            if (url.includes("people")) {
                displayPeopleDetails(data);
            } else if (url.includes("planets")) {
                displayPlanetDetails(data);
            }
        });
    });

  
    const getIcon = document.createElement("img");
    getIcon.src = 'img/reload1.png';
    getIcon.alt = 'reload icon';
    getIcon.className = 'reload-icon';
  
    reloadBtn.appendChild(getIcon);
    historyItems.appendChild(reloadBtn);
  
    const textNode = document.createTextNode(apiReturn.name);
    historyItems.appendChild(textNode);
  
    recentSearches.insertBefore(historyItems, recentSearches.children[0]);
  
    storeLocally(({name: apiReturn.name, url: url}));
}
  
export function storeLocally(item) {
    let storedHistory = JSON.parse(localStorage.getItem('storedContent')) || [];
    storedHistory.unshift(item);

    localStorage.setItem('storedContent', JSON.stringify(storedHistory));
    console.log('Sparat i localStorage: ' + JSON.stringify(storedHistory));
}
  
export function getStorage() {
      const storedHistory = JSON.parse(localStorage.getItem('storedContent'));
  
      if (storedHistory && storedHistory.length > 0) {
          recentSearches.innerHTML = '';
  
          storedHistory.forEach(item => {
              const historyItems = document.createElement("span");
              historyItems.className = 'history-item';
  
              const reloadBtn = document.createElement("button");
              reloadBtn.className = 'reload-btn';
              reloadBtn.addEventListener('click', () => {
                getApiInfo(item.url).then(data => {
                    if (item.url.includes("people")) {
                      displayPeopleDetails(data);
                      document.querySelector("#personname-header").style.visibility = "visible";
                      document.querySelector("#character-header").style.visibility = "visible";

                    } else if (item.url.includes("planets")) {
                      displayPlanetDetails(data);
                      document.querySelector(".table1").style.visibility = "collapse";
                      document.querySelector("#character-header").style.visibility = "collapse";
                      document.querySelector("#personname-header").style.visibility = "collapse";

                    }
                  });
                });
  
              const getIcon = document.createElement("img");
              getIcon.src = 'img/reload1.png';
              getIcon.alt = 'reload icon';
              getIcon.className = 'reload-icon';
  
              reloadBtn.appendChild(getIcon);
              historyItems.appendChild(reloadBtn);
  
              const textNode = document.createTextNode(item.name);
              historyItems.appendChild(textNode);
  
  
              recentSearches.appendChild (historyItems);
          });
      } else {
          console.log('Inget i localStorage');
      }
  }