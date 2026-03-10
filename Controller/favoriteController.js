import User from '../schemas/User.js';

export const getMyFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.favorites || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addFavorite = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { 
            $addToSet: { favorites: req.params.pokemonId } 
        });
        res.json({ message: "Pokémon ajouté aux favoris !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const removeFavorite = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { 
            $pull: { favorites: req.params.pokemonId } 
        });
        res.json({ message: "Pokémon retiré des favoris." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};