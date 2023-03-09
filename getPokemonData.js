const fs=require('fs')

arr=[]
PokemonDataArr=[]
let setLanguage='en'//filter laungage

function get_species_url(i){//url to get pokemon description
    return `https://pokeapi.co/api/v2/pokemon-species/${i}/`
}

function get_pokemon_url(i){//url to get pokemon data
    return `https://pokeapi.co/api/v2/pokemon/${i}/`
}

async function getUrl(url){//will fetch the url
    return await fetch(url)
}


async function getData(url){//will fetch the url, then convert it to an object
    return await getUrl(url).then( (data)=>{
    return data.json()
    })
}
function get_pokemon_image(i){//url to get pokemon data
    return `https://www.serebii.net/art/th/${i}.png`
}

async function LoopGetData(){//will iterate through pokemons
    for(let i=1;i<151;i++){//how many pokemon it will get
        const speciesData=await getData(get_species_url(i))
        const pokemonData=await getData(get_pokemon_url(i))
        const evolution_url=speciesData.evolution_chain.url//have to get evolution url from here becuase the indexing for the pokemon changes
        const evolutionData=await getData(evolution_url)
        const pokemonImage=get_pokemon_image(i)
        await arr.push({species:speciesData, pokemon:pokemonData,evolution:evolutionData,image:pokemonImage})//push to array as an object
    }
}

async function saveData(data){
    const fs = require('fs');

    console.log(data)
    
    let jsonString = JSON.stringify(data);
    
    fs.writeFile('data.json', jsonString, function(err) {
      if (err) {
        console.log('Error writing file', err);
      } else {
        console.log('File saved');
      }
    });
    }

LoopGetData().then(()=>{//calls our main fuction. "then." becuase it is async. this will return an object full of data that we want
    for (let j=0;j<arr.length;j++){
        const name=arr[j].pokemon.name
        const types=arr[j].pokemon.types.map((i)=>{
            return i.type.name
        })
        const abilities=arr[j].pokemon.abilities.map((i)=>{
            return i.ability.name
        })

        let evolutionItems=[]
        arr[j].evolution.chain.evolves_to.map((i)=>{
            try{
                evolutionItems.push(i.evolution_details[0].item.name)
                
            }catch{}
        })

        let flavourText=[]


        for(let i=0;i<arr[j].species.flavor_text_entries.length;i++){
            const language = arr[j].species.flavor_text_entries[i].language.name
            
            if(language===setLanguage){
                const text=arr[j].species.flavor_text_entries[i].flavor_text
                if(!text.toUpperCase().includes(name.toUpperCase()))
                flavourText.push(text)
              }   
        }
        let dataObj={description:flavourText,name:name,evolutionItem:evolutionItems,types:types,abilities:abilities, image:arr[j].image}
        PokemonDataArr.push(dataObj)
    }
}).then(()=>{
    saveData(PokemonDataArr)

    for (let i=0;i<PokemonDataArr.length;i++){
        console.log(i)
        console.log(PokemonDataArr[i])
    }
    
})



