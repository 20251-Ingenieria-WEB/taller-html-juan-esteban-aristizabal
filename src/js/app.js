// script.js
//definicion de variables
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');

let nextPageUrl = null;
let currentQuery = '';
let residentChunks = [];
let residentIndex = 0;
let isLoadingLocation = false;
// Agregar evento de clic al botón de búsqueda
searchButton.addEventListener('click', () => {
  currentQuery = searchInput.value.trim();
  fetchCharacters(currentQuery);
});
// Agregar evento de entrada al campo de búsqueda
document.addEventListener('DOMContentLoaded', () => {
  fetchCharacters();
});
// Agregar evento de entrada al campo de búsqueda
async function fetchCharacters(query = '', url = null) {
  // Limpiar el contenedor de resultados si no hay URL
  if (!url) {
    resultsContainer.innerHTML = '<p>Loading...</p>';
  }
//buscar personajes por nombre
  try {
    let apiUrl = url || 'https://rickandmortyapi.com/api/character';
    if (query && !url) {
      apiUrl += `/?name=${encodeURIComponent(query)}`;
    }

    const response = await fetch(apiUrl);
    const data = await response.json();
// Verificar si hay resultados
    if (data.results && data.results.length > 0) {
      // Si hay resultados, limpiar el contenedor de resultados
      if (!url) resultsContainer.innerHTML = '';
      //llamar a la funcion que carga los personajes en la pagina
      renderCharacters(data.results);
      nextPageUrl = data.info.next;
      // Si hay más páginas, mostrar el botón de cargar más
      renderLoadMoreButton();
    } else {
      // Si no hay resultados, mostrar un mensaje
      resultsContainer.innerHTML = '<p>No characters found.</p>';
      removeLoadMoreButton();
    }
  } catch (error) {
    // Si hay un error, mostrar un mensaje
    resultsContainer.innerHTML = '<p>Error fetching characters.</p>';
    removeLoadMoreButton();
  }
}

async function renderCharacters(characters) {
  //for inicial para recorrer los personajes
  for (const char of characters) {
    const firstEpisodeUrl = char.episode[0];
    const originName = char.origin.name;
    const originUrl = char.origin.url;

    let episodeName = 'Unknown';
    let episodeCode = 'Unknown';
    try {
      // Obtener el nombre y código del primer episodio
      const episodeResponse = await fetch(firstEpisodeUrl);
      const episodeData = await episodeResponse.json();
      episodeName = episodeData.name;
      episodeCode = episodeData.episode;
    } catch (e) {
      console.error('Error fetching episode:', e);
    }
    // Crear un elemento de tarjeta para cada personaje
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${char.image}" alt="${char.name}" />
      <h2>${char.name}</h2>
      <p>Especie: ${char.species}</p>
      <p>Estado: ${char.status}</p>
      <p>Origen: <a href="#" class="origin-link" data-url="${originUrl}">${originName}</a></p>
      <p>primera aparicion: ${episodeCode} - ${episodeName}</p>
      <p>Ultima ubicacion: ${char.location.name}</p>
    `;
    // Agregar la tarjeta al contenedor de resultados
    resultsContainer.appendChild(card);
  }

  // Mover el botón de cargar más al final si existe
  const loadMoreButton = document.getElementById('loadMore');
  if (loadMoreButton) {
    resultsContainer.appendChild(loadMoreButton);
  }

  // Agregar eventos de redirección para los links de origen
  document.querySelectorAll('.origin-link').forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const url = e.target.dataset.url;
      if (url) {
        await fetchLocationCharacters(url);
      }
    });
  });
}
//funcion para cargar los personajes de la ubicacion
async function fetchLocationCharacters(locationUrl) {
  //intentar cargar los personajes de la ubicacion
  try {
    resultsContainer.innerHTML = '<p>Loading characters from location...</p>';
    const response = await fetch(locationUrl);
    const locationData = await response.json();
    const residentUrls = locationData.residents;
// Verificar si hay residentes
    if (residentUrls.length === 0) {
      resultsContainer.innerHTML = '<p>No characters found in this location.</p>';
      return;
    }

    // dividir residentes en tandas de 20
    residentChunks = [];
    for (let i = 0; i < residentUrls.length; i += 20) {
      residentChunks.push(residentUrls.slice(i, i + 20));
    }
    residentIndex = 0;
    isLoadingLocation = true;
    resultsContainer.innerHTML = '';
    await loadMoreResidents();

  } catch (error) {
    // Si hay un error, mostrar un mensaje
    resultsContainer.innerHTML = '<p>Error loading location characters.</p>';
  }
}
//funcion para añadir mas personajes de la ubicacion
async function loadMoreResidents() {
  // Verificar si ya se están cargando los residentes
  if (residentIndex >= residentChunks.length) return;
// cargar los residentes
  const currentChunk = residentChunks[residentIndex];
  const charactersData = await Promise.all(
    currentChunk.map(url => fetch(url).then(res => res.json()))
  );
  // Renderizar los personajes de la ubicación
  renderCharacters(charactersData);
  residentIndex++;
// Verificar si hay más residentes para cargar
  if (residentIndex < residentChunks.length) {
    renderLoadMoreButton(true);
  } else {
    // Si no hay más residentes, eliminar el botón de cargar más
    isLoadingLocation = false;
    removeLoadMoreButton();
  }
}
//funcion para cargar mostrar el boton de cargar mas
function renderLoadMoreButton(isResident = false) {
  removeLoadMoreButton();
/// Crear el botón de cargar más residentes o personajes
  const button = document.createElement('button');
  button.id = 'loadMore';
  button.textContent = 'cargar mas';
  button.style.width = '100%';
  button.className = 'load-more-button';

  if (isResident) {
    // Agregar evento de clic para cargar más residentes
    button.addEventListener('click', () => loadMoreResidents());
  } else if (nextPageUrl) {
    // Agregar evento de clic para cargar más personajes
    button.addEventListener('click', () => fetchCharacters(currentQuery, nextPageUrl));
  } else {
    return;
  }
/// Agregar el botón al contenedor de resultados
  resultsContainer.appendChild(button);
}
//funcion para eliminar el boton de cargar mas
function removeLoadMoreButton() {
  const existingButton = document.getElementById('loadMore');
  if (existingButton) {
    existingButton.remove();
  }
}
