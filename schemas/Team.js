import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    pokemons: [{ 
        type: Number, 
        ref: 'Pokemon'
    }]
});

teamSchema.path('pokemons').validate(function(value) {
    return value.length <= 6;
}, "Maximum 6 Pokémon par équipe.");

export default mongoose.model('Team', teamSchema);