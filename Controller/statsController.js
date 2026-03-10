import Pokemon from '../schemas/pokemons.js';

export const getStats = async (req, res) => {
    try {
        const stats = await Pokemon.aggregate([
            {
                $facet: {
                    countByType: [
                        { $unwind: "$type" },
                        { $group: { _id: "$type", count: { $sum: 1 }, avgHP: { $avg: "$base.HP" } } }
                    ],
                    topAttack: [
                        { $sort: { "base.Attack": -1 } },
                        { $limit: 1 }
                    ],
                    topHP: [
                        { $sort: { "base.HP": -1 } },
                        { $limit: 1 }
                    ]
                }
            }
        ]);
        res.json(stats[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};