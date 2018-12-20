const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded', (event) => {
    const main = document.querySelector('main')

    fetch(TRAINERS_URL)
    .then(r => r.json())
    .then(trainers => {
        const main = document.querySelector('main')

        for(let trainer of trainers){
            main.innerHTML += `<div class="card" data-id=${trainer.id}><p>${trainer.name}</p>
            <button data-trainer-id=${trainer.id} >Add Pokemon</button>
            <ul class= "pokemon" data-trainer-id=${trainer.id} id= ${trainer.name} >
            </ul>
          </div>`
            
        const pokemonList = main.querySelector(`#${trainer.name}`)
          for(let pokemon of trainer.pokemons){
            pokemonList.innerHTML += `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id=${pokemon.id}>Release</button></li>`
          }
        }
    })

    main.addEventListener('click', (event) => {
        if (event.target.innerHTML === "Add Pokemon"){

            let trainerId = parseInt(event.target.dataset.trainerId)

            let numPokemons = event.target.parentNode.querySelector('ul').children.length

            

            if (numPokemons < 6){
                fetch(POKEMONS_URL, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    
                    method: "POST",

                    body: JSON.stringify({trainer_id: trainerId})
                })
                .then(r => r.json())
                .then(pokemon => {
                    const pokemonList = event.target.parentNode.querySelector('ul')

                    pokemonList.innerHTML += `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id=${pokemon.id}>Release</button></li>`
                })

            }


        }
        else if(event.target.innerHTML === "Release"){
            let pokemon_id = event.target.dataset.pokemonId

            fetch(POKEMONS_URL+`/${pokemon_id}`, {method: "DELETE"})
            .then(r => r.json())

            event.target.parentNode.remove()
        }
    })





})
