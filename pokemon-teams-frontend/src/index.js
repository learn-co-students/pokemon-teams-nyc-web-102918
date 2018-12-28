const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`


document.addEventListener( 'DOMContentLoaded', populate)

//agrego un evento para ver cuando el usuario ha clicked the boton de eliminar 
document.addEventListener('click', (e) => {
    if (e.target.className === 'release') {
        releasePokemon(e.target.dataset.id,e.target.parentElement)
    }
})


  function populate() {
      fetch(TRAINERS_URL)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        console.log(typeof(data))

        data.forEach(trainer => {
            let newTrainer = document.createElement('div') //estoy creando donde voy a poner mis pokemon
                              newTrainer.className = "card"
                              newTrainer.dataset.id = trainer.id
                              newTrainer.innerHTML = `<p>${trainer.name}</p>`
                              let newButton = document.createElement('button')
                              let pokemonTeam = document.createElement('ul')
                              pokemonTeam.className = 'team-obtainer'

                              // tengo otro array adentro del primero por eso voy iterate de next level
                              trainer.pokemons.forEach( pokemon => {
                                  pokemonTeam.appendChild(createPokemon(pokemon))
                              })
                              newTrainer.append(newButton,pokemonTeam)
                              // esto lo dice el enunciado
                              document.querySelector('main').appendChild(newTrainer)
                              newButton.innerText = "Add Pokemon"
                              //Estoy creando un evento para escuchar cuando el botom de add sea clicked
                              newButton.addEventListener('click', (e) => {
                                addPokemon(pokemonTeam, e.target.parentElement.dataset.id)
                              })
        })
      })

  } // fin de la funcion populate

  function createPokemon(pokemonObject){
    let pokemonLi = document.createElement('li')
    pokemonLi.innerText = `${pokemonObject.nickname} (${pokemonObject.species})`
    let releaseButton = document.createElement('button')
    releaseButton.className = 'release'
    releaseButton.dataset.id = pokemonObject.id
    releaseButton.innerText = "Release"
    pokemonLi.appendChild(releaseButton)
    return pokemonLi

  }

  function addPokemon(pokemonTeam,trainerId) {
    // utilizo este if porque no puede ser mas de seis pokemon en la card
    if (pokemonTeam.children.length < 6){
        let newPokemon = document.createElement('li')

        fetch(POKEMONS_URL, {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pokemon: {
                  // trainer_id es un attribute en el array del pokemon
                    trainer_id: trainerId
                }
            })
        })
            .then(res => res.json())
            .then(pokemon => {
                newPokemon.innerText = `${pokemon.nickname} (${pokemon.species})`
                pokemonTeam.appendChild(createPokemon(pokemon))
            })
    } else {
        alert("You need to release one of your Pokemon before adding another")
    }
}


function releasePokemon(pokemonId,pokemonLi){
    fetch(POKEMONS_URL + `/${pokemonId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(pokemonLi.parentElement.removeChild(pokemonLi))
}
