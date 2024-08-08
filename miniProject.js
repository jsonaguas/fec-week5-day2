document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const pokemonDetails = document.getElementById('pokemonDetails');

    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.trim().toLowerCase();
            if (query) {
                fetchPokemonData(query);
            }
        });
    }

    if (pokemonDetails) {
        const urlParams = new URLSearchParams(window.location.search);
        const pokemonId = urlParams.get('id');
        if (pokemonId) {
            fetchPokemonDetails(pokemonId);
        } else {
            pokemonDetails.innerHTML = `<div class="alert alert-danger" role="alert">No Pokémon ID found in URL parameters.</div>`;
        }
    }

    async function fetchPokemonData(query) {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${query}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            displaySearchResult(data);
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
            searchResults.innerHTML = `<div class="alert alert-danger" role="alert">Pokémon not found. Please try again.</div>`;
        }
    }

    function displaySearchResult(data) {
        searchResults.innerHTML = `
            <div class="col-md-4">
                <div class="card mb-4">
                    <img src="${data.sprites.front_default}" class="card-img-top" alt="${data.name}">
                    <div class="card-body">
                        <h5 class="card-title">${data.name}</h5>
                        <a href="details.html?id=${data.id}" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            </div>
        `;
    }

    async function fetchPokemonDetails(id) {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            displayPokemonDetails(data);
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
            pokemonDetails.innerHTML = `<div class="alert alert-danger" role="alert">Pokémon not found. Please try again.</div>`;
        }
    }

    function displayPokemonDetails(data) {
        pokemonDetails.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${data.name}</h5>
                    <img src="${data.sprites.front_default}" alt="${data.name}" class="img-fluid mb-3">
                    <div class="accordion" id="pokemonAccordion">
                        <div class="card">
                            <div class="card-header" id="headingAbilities">
                                <h2 class="mb-0">
                                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseAbilities">
                                        Abilities
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseAbilities" class="collapse show" data-parent="#pokemonAccordion">
                                <div class="card-body">
                                    <ul>
                                        ${data.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header" id="headingTypes">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTypes">
                                        Types
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseTypes" class="collapse" data-parent="#pokemonAccordion">
                                <div class="card-body">
                                    <ul>
                                        ${data.types.map(type => `<li>${type.type.name}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header" id="headingStats">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseStats">
                                        Stats
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseStats" class="collapse" aria-labelledby="headingStats" data-parent="#pokemonAccordion">
                                <div class="card-body">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Stat</th>
                                                <th scope="col">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${data.stats.map(stat => `
                                                <tr>
                                                    <td>${stat.stat.name}</td>
                                                    <td>${stat.base_stat}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
});