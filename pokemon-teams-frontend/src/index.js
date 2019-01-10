const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const pokemonContainer = document.querySelector('#pokemon-container')
// console.log(pokemonContainer);
let allTrainers = []

fetch(TRAINERS_URL)
.then(res => res.json())
.then(data => {
  // console.log(data)
  allTrainers = data
  addTrainerCards(data)
})

function addTrainerCards(array) {
  array.forEach((trainer) => {
    const pokemons = trainer.pokemons
      const pokeTeam = pokemons.map(pokemon => renderPokemon(pokemon)).join("")
    pokemonContainer.innerHTML += `
    <div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
      <button class='add'data-trainer-id="${trainer.id}">Add Pokemon</button>
      <ul>${pokeTeam}</ul>
    </div>
  `
  })
}

function renderPokemon(pokemon) {
  const pokeName = `${pokemon.nickname} (${pokemon.species})`
  return `
    <li data-pokemon_id="${pokemon.id}"> ${pokeName}
      <button class="release" data-trainer-id="${pokemon.trainer_id}" data-pokemon-id="${pokemon.id}">Release</button>
      </li>
        `
}
pokemonContainer.addEventListener('click', (e) => {
  const trainerId = e.target.dataset.trainerId
  const trainerCard = pokemonContainer.querySelector(`.card[data-id="${trainerId}"]`)
  const pokeList = trainerCard.querySelector("ul")
  // console.log(trainerId);
  // console.log(trainerCard)
  // console.log(pokeList);
  if(e.target.className === 'add') {
  // console.log(e.target)
  fetch(POKEMONS_URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      trainer_id: trainerId
    })
  })
  .then(res => res.json())
  .then(data => {
    pokeList.innerHTML += renderPokemon(data)
  })
}
else if (e.target.className === 'release') {
  const pokemonId = e.target.dataset.pokemonId
  fetch(POKEMONS_URL +`/${pokemonId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          trainer_id: trainerId
        })
      })
  .then(res => res.json())
  .then(data => {
    const removedPoke = pokeList.querySelector(`li[data-pokemon_id="${data.id}"]`)
    removedPoke.remove()
  })
  }
})
