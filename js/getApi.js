const peopleUrl = "https://swapi.dev/api/people/";
const planetsUrl = "https://swapi.dev/api/planets/";
let apiUrl;

export async function getPeopleInfo(searchQuery) {
  apiUrl = peopleUrl + searchQuery;
  const searchResponse = await fetch(apiUrl);
  const data = await searchResponse.json();

  return data.results;
}

export async function getPlanetInfo(searchQuery) {
  apiUrl = planetsUrl + searchQuery;
  const searchResponse = await fetch(apiUrl);
  const data = await searchResponse.json();

  return data.results;
}

export async function getBothInfo(searchQuery) {
  const [peopleResponse, planetsResponse] = await Promise.all([
    fetch(peopleUrl + searchQuery),
    fetch(planetsUrl + searchQuery),
  ]);

  const [peopleData, planetData] = await Promise.all([
    peopleResponse.json(),
    planetsResponse.json(),
  ]);

  return [...peopleData.results, ...planetData.results];
}

export async function getApiInfo(url) {
  const response = await fetch(url);
  const data = await response.json();
  console.log("Data från API:", data); // Lägg till denna rad för att se vad som returneras
  return data;
return data 
}
