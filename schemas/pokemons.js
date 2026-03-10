import mongoose from 'mongoose';

const ALLOWED_TYPES = ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"];

const pokemonSchema = new mongoose.Schema({
    id: { 
        type: Number, 
        required: [true, "L'ID est obligatoire"], 
        unique: true,
        min: [1, "L'ID doit être un entier positif"]
    },
    name: {
        english: String,
        french: String,
        japanese: String,
        chinese: String
    },
    type: [{ 
        type: String, 
        enum: { values: ALLOWED_TYPES, message: "{VALUE} n'est pas un type de Pokémon valide" }
    }],
    base: {
        HP: { type: Number, min: 1, max: 255 },
        Attack: { type: Number, min: 1, max: 255 },
        Defense: { type: Number, min: 1, max: 255 },
        SpecialAttack: { type: Number, min: 1, max: 255 },
        SpecialDefense: { type: Number, min: 1, max: 255 },
        Speed: { type: Number, min: 1, max: 255 }
    },
    image: String
});

export default mongoose.model('Pokemon', pokemonSchema);