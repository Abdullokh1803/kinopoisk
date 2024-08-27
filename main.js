const API_KEY = "e06b8de4-2634-4b23-b325-b20ad6d0be65";
const API_URL_POPULAR = (page) =>
  `https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=${page}`;

const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

const API_URL_MOVIE_DETAILS =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

getMovies(API_URL_POPULAR(1));

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  showMovies(respData);
}

function getClassByRate(golos) {
  if (golos >= 7) {
    return "green";
  } else if (golos > 5) {
    return "orange";
  } else {
    return "red";
  }
}

function showMovies(data) {
  const moviesElem = document.querySelector(".movies");

  moviesElem.innerHTML = "";

  if (data.items) {
    data.items.forEach((movie) => {
      const movieElem = document.createElement("div");
      movieElem.classList.add("movie");
      movieElem.innerHTML = `
                <div class="movie">
              <div class="movie__cover-inner">
                <img
                  src="${movie.posterUrlPreview}"
                  alt="${movie.nameRu}"
                  class="movie__cover"
                />
                <div class="movie__cover--darkened"></div>
              </div>
              <div class="movie__info">
                <div class="movie__title">${movie.nameRu}</div>
                <div class="movie__category">${movie.genres.map(
                  (genre) => ` ${genre.genre}`
                )}</div>
                <div class="movie__average movie__average--${getClassByRate(
                  movie.ratingKinopoisk
                )}">${movie.ratingKinopoisk === null ? 0 : movie.ratingKinopoisk}</div>
              </div>
            </div>
            `;
      movieElem.addEventListener("click", () => openModal(movie.kinopoiskId));

      moviesElem.appendChild(movieElem);
    });
  } else if (data.films) {
    data.films.forEach((movie) => {
      const movieElem = document.createElement("div");
      movieElem.classList.add("movie");
      movieElem.innerHTML = `
                <div class="movie">
              <div class="movie__cover-inner">
                <img
                  src="${movie.posterUrlPreview}"
                  alt="${movie.nameRu}"
                  class="movie__cover"
                />
                <div class="movie__cover--darkened"></div>
              </div>
              <div class="movie__info">
                <div class="movie__title">${movie.nameRu}</div>
                <div class="movie__category">${movie.genres.map(
                  (genre) => ` ${genre.genre}`
                )}</div>
                <div class="movie__average movie__average--${getClassByRate(
                  movie.rating
                )}">${movie.rating === "null" ? 0 : movie.rating}</div>
              </div>
            </div>
            `;
      movieElem.addEventListener("click", () => openModal(movie.filmId));
      moviesElem.appendChild(movieElem);
    });
  }
}

const form = document.querySelector("form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);
    search.value = "";
  }
});

function paginatFunc() {
  const paginat = document.querySelector(".paginat");

  for (let i = 1; i <= 35; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.addEventListener("click", () => {
      getMovies(API_URL_POPULAR(i));
      updateActivePage(i);
    });
    paginat.appendChild(button);
  }
}

function updateActivePage(activePage) {
  const buttons = document.querySelectorAll(".paginat button");
  buttons.forEach((button, index) => {
    if (index + 1 === activePage) {
      button.style.color = "#ffd80e";
    } else {
      button.style.color = "#fff";
    }
  });
}

paginatFunc();
updateActivePage(1);

// Modal

const modal = document.querySelector(".modal");

async function openModal(id) {
  document.body.classList.add("stop-scrolling");

  const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  console.log(respData);

  modal.classList.add("modal--show");

  modal.innerHTML = `
    <div class="modal__card">
      <img class="modal__movie-backdrop" src="${respData.posterUrlPreview}" alt="">
      <h2>
        <span class="modal__movie-title">${respData.nameRu}</span>
        <span class="modal__movie-release-year"> - ${respData.year}</span>
      </h2>
      <ul class="modal__movie-info">
        <div class="loader"></div>
        <li class="modal__movie-genre">Жанр - ${respData.genres.map((genre) => ` ${genre.genre}`)}</li>
        ${respData.filmLength === null ? "" : `<li class="modal__movie-runtime">Время: ${respData.filmLength} минут</li>`}
        <li>Сайт: <a class="modal__movie-site" href='${respData.webUrl}'>${respData.webUrl}</a></li>
        ${respData.description === null ? "" : `<li class="modal__movie-runtime">Описание: ${respData.description}</li>`}
      </ul>
      <button type="button" class="modal__button-close">Закрыть</button>
    </div>
  `;
  const btnClose = document.querySelector(".modal__button-close");
  btnClose.addEventListener("click", () => closeModal());
}

function closeModal() {
  modal.classList.remove("modal--show");
  document.body.classList.remove("stop-scrolling");
}

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    closeModal();
  }
});
