const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const container = document.querySelector('#pokemon-trainers')
let allData = ""


document.addEventListener('DOMContentLoaded', function(){

  fetch(TRAINERS_URL)
  .then(function(response){
    return response.json()
  })
  .then(function(parsedData){
    allData = parsedData
    parsedData.forEach(function(pokemonTrainer){
      container.innerHTML += `<div class="card" data-id="${pokemonTrainer.id}"><p>${pokemonTrainer.name}</p>
                                <button data-trainer-id="${pokemonTrainer.id}" data-action = "add-pokemon">Add Pokemon</button>
                                <ul class= "pokemon" data-trainer-id=${pokemonTrainer.id} id= ${pokemonTrainer.name} >
                                </ul>
                              </div>`

    const pokemonUl = document.querySelector(`#${pokemonTrainer.name}`)
    pokemonTrainer.pokemons.forEach(function(pokemon){
      pokemonUl.innerHTML += `<li id=pokemon-${pokemon.id}>${pokemon.nickname} (${pokemon.species})<button class="release" data-pokemon-id="${pokemon.id}" data-action="release-pokemon" >Release</button></li>`
      })
    })
  })

  container.addEventListener('click', function(event){
    let liLength = event.target.parentNode.querySelector('ul').children.length
    let li = event.target.parentNode.querySelector('ul')
    if (event.target.dataset.action === 'add-pokemon' && liLength < 6){
      let trainerId = event.target.dataset.trainerId
      fetch(POKEMONS_URL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          trainer_id:trainerId
        })
      })
      .then(function(response){
        return response.json()
      })
      .then(function(addedPoke){
        console.log(addedPoke)
          li.innerHTML +=`<li id=pokemon-${addedPoke.id}>${addedPoke.nickname} (${addedPoke.species})<button class="release" data-pokemon-id="${addedPoke.id}">Release</button></li>`
        })
    }
  })

container.addEventListener('click', function(event){
  if (event.target.dataset.action === 'release-pokemon'){
    let pokeId = event.target.dataset.pokemonId
    let pokemonListItem = document.querySelector(`#pokemon-${pokeId}`)
    pokemonListItem.remove()
    console.log(pokemonListItem)
    fetch(`${POKEMONS_URL}/${pokeId}`, {method:"DELETE"})
  }
})











}) //END OF DOM DOMContentLoaded
