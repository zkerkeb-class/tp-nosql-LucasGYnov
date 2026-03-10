import Pokemon from '../schemas/pokemons.js';

export const getAll = async (req, res) => {
    try {
        let filter = {};
        if (req.query.type) filter.type = req.query.type;
        if (req.query.name) {
            const searchRegex = { $regex: req.query.name, $options: 'i' };
            filter.$or = [
                { "name.french": searchRegex }, { "name.english": searchRegex },
                { "name.japanese": searchRegex }, { "name.chinese": searchRegex }
            ];
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        let query = Pokemon.find(filter);
        if (req.query.sort) query = query.sort(req.query.sort);
        else query = query.sort('id');

        const data = await query.skip(skip).limit(limit);
        const total = await Pokemon.countDocuments(filter);

        res.json({
            data,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOne = async (req, res) => {
    try {
        const pokemon = await Pokemon.findOne({ id: req.params.id });
        if (!pokemon) return res.status(404).json({ error: 'Pokémon non trouvé' });
        res.json(pokemon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const newPokemon = await Pokemon.create(req.body);
        res.status(201).json(newPokemon);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const updated = await Pokemon.findOneAndUpdate(
            { id: req.params.id }, req.body, { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ error: 'Pokémon non trouvé' });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const deleted = await Pokemon.findOneAndDelete({ id: req.params.id });
        if (!deleted) return res.status(404).json({ error: 'Pokémon non trouvé' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};