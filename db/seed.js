import 'dotenv/config';
import mongoose from 'mongoose';
import pokemonList from '../data/pokemonsList.js';
import Pokemon from '../schemas/pokemons.js';

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connecté à MongoDB pour le seed');

        await Pokemon.deleteMany({});
        console.log('Collection vidée.');

        await Pokemon.insertMany(pokemonList);
        console.log(`${pokemonList.length} Pokémon insérés avec succès`);


        await mongoose.connection.close();
        console.log('Connexion fermée.');

    } catch (error) {
        console.error('Erreur pendant le seed :', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();