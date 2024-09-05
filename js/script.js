document.addEventListener("DOMContentLoaded", function () {
    const sliderWrapper = document.querySelector(".slider-wrapper");
    const prevButton = document.querySelector(".prev-button");
    const nextButton = document.querySelector(".next-button");
    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modal-body");
    const closeButton = document.querySelector(".close-button");
  
    const nameFilter = document.getElementById("name-filter");
    const houseFilter = document.getElementById("house-filter");
    const speciesFilter = document.getElementById("species-filter");
  
    let allCharacters = [];
    let displayedStartIndex = 0;
    const itemsPerPageDefault = 2;
    const itemsPerPageMobile = 1;
    let itemsPerPage = itemsPerPageDefault;
  
    async function fetchCharacterData() {
      try {
        const response = await fetch("https://hp-api.onrender.com/api/characters");
        if (!response.ok) throw new Error("Network response was not ok");
        allCharacters = await response.json();
        populateFilters();
        displayCharacters();
      } catch (error) {
        console.error("Error fetching character data:", error);
      }
    }
  
    function populateFilters() {
      const houses = new Set();
      const species = new Set();
  
      allCharacters.forEach((character) => {
        if (character.house) houses.add(character.house);
        if (character.species) species.add(character.species);
      });
  
      houses.forEach((house) => {
        const option = document.createElement("option");
        option.value = house;
        option.textContent = house;
        houseFilter.appendChild(option);
      });
  
      species.forEach((specie) => {
        const option = document.createElement("option");
        option.value = specie.toLowerCase();
        option.textContent = specie;
        speciesFilter.appendChild(option);
      });
    }
  
    function displayCharacters() {
      sliderWrapper.innerHTML = "";
  
      const filteredCharacters = filterCharacters();
      const endIndex = Math.min(displayedStartIndex + itemsPerPage, filteredCharacters.length);
      for (let i = displayedStartIndex; i < endIndex; i++) {
        const character = filteredCharacters[i];
        const card = document.createElement("div");
        card.classList.add("card-container");
  
        card.innerHTML = `
          <div class="card">
              <img src="${character.image || "https://via.placeholder.com/150"}" alt="${character.name || "Character Image"}" loading="lazy" style="width: 150px; height: 250px; object-fit: cover; border-radius: 10px;"/>
              <div class="card-content">
                  <h2 class="card-title">${character.name || "Unknown"}</h2>
                  <p class="card-content-description"><span class="card-content-attribute">House: </span>${character.house || "N/A"}</p>
                  <p class="card-content-description"><span class="card-content-attribute">Date Of Birth: </span>${character.dateOfBirth || "N/A"}</p>
                  <p class="card-content-description"><span class="card-content-attribute">Ancestry: </span>${character.ancestry || "N/A"}</p>
                  <button class="read-more-button">Full information</button>
              </div>
          </div>
          `;
  
        sliderWrapper.appendChild(card);
      }
  
      updateButtonStates();
      addEventListenersToButtons();
    }
  
    function filterCharacters() {
      const nameValue = nameFilter.value.toLowerCase();
      const houseValue = houseFilter.value;
      const speciesValue = speciesFilter.value.toLowerCase();
  
      return allCharacters.filter((character) => {
        const matchesName = character.name && character.name.toLowerCase().includes(nameValue);
        const matchesHouse = houseValue ? character.house === houseValue : true;
        const matchesSpecies = speciesValue ? character.species && character.species.toLowerCase() === speciesValue : true;
        return matchesName && matchesHouse && matchesSpecies;
      });
    }
  
    function preventScroll() {
        document.body.classList.add("no-scroll");
    }
    
    function allowScroll() {
        document.body.classList.remove("no-scroll");
    }
  
    function addEventListenersToButtons() {
      const readMoreButtons = document.querySelectorAll(".read-more-button");
      readMoreButtons.forEach((button, index) => {
        button.addEventListener("click", () => openModal(filterCharacters()[displayedStartIndex + index]));
      });
    }
  
    function openModal(character) {
      if (!character) return;
  
      modalBody.innerHTML = `
  <div style="display: flex; gap: 20px;">
      <div class="character-image">
          <img src="${character.image || "https://via.placeholder.com/150"}" alt="${character.name || "Character Image"}" style="width: 250px; height: 350px; object-fit: cover; border-radius: 10px;"/>
      </div>
      <div style="display: flex; flex-direction: column;">
          <h2 class="card-title" style="font-size: 24px; margin-bottom: 20px;">${character.name || "Unknown"}</h2>
          <div style="display: grid; align-items: center; gap: 10px;">
              <p style="margin: 0;"><span class="card-content-atribute" style="font-weight: bold;">Alternate names: </span>${character.alternate_names && character.alternate_names.length > 0 ? character.alternate_names.join(", ") : "N/A"}</p>
              <p style="margin: 0;"><span class="card-content-atribute" style="font-weight: bold;">House: </span>${character.house || "N/A"}</p>
              <p style="margin: 0;"><span class="card-content-atribute" style="font-weight: bold;">Date Of Birth: </span>${character.dateOfBirth || "N/A"}</p>
              <p style="margin: 0;"><span class="card-content-atribute" style="font-weight: bold;">Species: </span>${character.species || "N/A"}</p>
              <p style="margin: 0;"><span class="card-content-atribute" style="font-weight: bold;">Gender: </span>${character.gender || "N/A"}</p>
              <p style="margin: 0;"><span class="card-content-atribute" style="font-weight: bold;">Ancestry: </span>${character.ancestry || "N/A"}</p>
              <p style="margin: 0;"><span class="card-content-atribute" style="font-weight: bold;">Eye Colour: </span>${character.eyeColour || "N/A"}</p>
              <p style="margin: 0;"><span class="card-content-atribute" style="font-weight: bold;">Hair Colour: </span>${character.hairColour || "N/A"}</p>
              <p style="margin: 0;"><span class="card-content-atribute" style="font-weight: bold;">Wand: </span>${character.wand ? `${character.wand.wood || "N/A"} wood, ${character.wand.core || "N/A"} core, ${character.wand.length || "N/A"} inches` : "N/A"}</p>
              <p style="margin: 0;"><span class="card-content-atribute" style="font-weight: bold;">Patronus: </span>${character.patronus || "N/A"}</p>
          </div>
      </div>
  </div>
  `;
      modal.style.display = "block";
      preventScroll();
    }
  
    closeButton.addEventListener("click", function () {
      modal.style.display = "none";
      allowScroll();
    });
  
    prevButton.addEventListener("click", function () {
      displayedStartIndex -= itemsPerPage;
      if (displayedStartIndex < 0) displayedStartIndex = 0;
      displayCharacters();
    });
  
    nextButton.addEventListener("click", function () {
      displayedStartIndex += itemsPerPage;
      if (displayedStartIndex >= filterCharacters().length) displayedStartIndex = filterCharacters().length - itemsPerPage;
      displayCharacters();
    });
  
    function updateButtonStates() {
      const filteredCharacters = filterCharacters();
      prevButton.disabled = displayedStartIndex === 0;
      nextButton.disabled = displayedStartIndex + itemsPerPage >= filteredCharacters.length;
    }
  
    function handleFilterChange() {
      displayedStartIndex = 0;
      displayCharacters();
    }
  
    nameFilter.addEventListener("input", handleFilterChange);
    houseFilter.addEventListener("change", handleFilterChange);
    speciesFilter.addEventListener("change", handleFilterChange);
  
    function adjustItemsPerPage() {
      itemsPerPage = window.innerWidth < 600 ? itemsPerPageMobile : itemsPerPageDefault;
      displayCharacters();
    }
  
    window.addEventListener("resize", adjustItemsPerPage);
    adjustItemsPerPage();
  
    fetchCharacterData();
});
