import express from 'express';
const router = express.Router();

import pokemonList from '../data/pokemonsList.js'; 

router.get('/pokemons', (req, res) => { 
    res.json(pokemonList);
});

router.get('/pokemon/:id', (req, res) => {  
    const pokemonId = parseInt(req.params.id, 10);
    const pokemon = pokemonList.find(p => p.id === pokemonId);
    
    if (pokemon) {
        res.json(pokemon);
    } else {
        res.status(404).json({ error: 'Pokémon non trouvé' });
    }
});

export default router;