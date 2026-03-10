import Team from '../schemas/Team.js';

export const getMyTeams = async (req, res) => {
    try {
        const teams = await Team.find({ user: req.user.id }).populate({
            path: 'pokemons',
            model: 'Pokemon',
            localField: 'pokemons',
            foreignField: 'id'
        });
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTeamById = async (req, res) => {
    try {
        const team = await Team.findOne({ _id: req.params.id, user: req.user.id }).populate({
            path: 'pokemons',
            model: 'Pokemon',
            localField: 'pokemons',
            foreignField: 'id'
        });
        if (!team) return res.status(404).json({ error: "Équipe non trouvée" });
        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createTeam = async (req, res) => {
    try {
        const team = await Team.create({ 
            ...req.body, 
            user: req.user.id 
        });
        res.status(201).json(team);
    } catch (error) {
        res.status(400).json({ error: "Erreur de création", details: error.message });
    }
};

export const updateTeam = async (req, res) => {
    try {
        const updatedTeam = await Team.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        ).populate({
            path: 'pokemons',
            model: 'Pokemon',
            localField: 'pokemons',
            foreignField: 'id'
        });

        if (!updatedTeam) {
            return res.status(404).json({ error: "Équipe non trouvée ou non autorisée" });
        }

        res.json(updatedTeam);
    } catch (error) {
        res.status(400).json({ error: "Erreur lors de la mise à jour", details: error.message });
    }
};

export const deleteTeam = async (req, res) => {
    try {
        const deleted = await Team.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!deleted) return res.status(404).json({ error: "Équipe non trouvée" });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};