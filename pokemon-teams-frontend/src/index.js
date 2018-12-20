document.addEventListener("DOMContentLoaded", function() {
  const BASE_URL = "http://localhost:3000"
  const TRAINERS_URL = `${BASE_URL}/trainers`
  const POKEMONS_URL = `${BASE_URL}/pokemons`
  const trainerContainer = document.getElementById("trainer-container")

  let allTrainers = []


  fetch(TRAINERS_URL)
  .then(r => r.json())
  .then(data => {
    allTrainers = data
    data.forEach(trainer => {
      const pokemons = trainer.pokemons
      const pokeTeam = pokemons.map(pokemon => renderPokemon(pokemon)).join("")
      trainerContainer.innerHTML += `
      <div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
        <button class="add" data-trainer_id="${trainer.id}">Add Pokemon</button>
        <ul>${pokeTeam}</ul>
      </div>`
    })
  })

  trainerContainer.addEventListener("click", e => {
    const trainerId = e.target.dataset.trainer_id
    const trainerCard = trainerContainer.querySelector(`.card[data-id="${trainerId}"]`)
    const pokeList = trainerCard.querySelector("ul")

    if (e.target.className === "add") {
      fetch(POKEMONS_URL, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({trainer_id: e.target.dataset.trainer_id})
      })
      .then(r => r.json())
      .then(data => {
        pokeList.innerHTML += renderPokemon(data)
      })
    } else if (e.target.className === "release") {
      fetch(POKEMONS_URL + `/${e.target.dataset.pokemon_id}`, {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({trainer_id: e.target.dataset.trainer_id})
      })
      .then(r => r.json())
      .then(data => {
        const removedPoke = pokeList.querySelector(`li[data-pokemon_id="${data.id}"]`)
        removedPoke.remove()
      })
    }
  })

  function renderPokemon(pokemon) {
    return `<li data-pokemon_id="${pokemon.id}">
      ${pokemon.nickname} (${pokemon.species})
      <button class="release"data-trainer_id="${pokemon.trainer_id}" data-pokemon_id="${pokemon.id}">Release</button>
    </li>`
  }
})
