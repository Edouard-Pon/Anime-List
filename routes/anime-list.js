const express = require('express');
const router = express.Router();
const AnimeList = require('../models/anime-list');
const Anime = require('../models/anime');
const { authenticateToken } = require('../middleware/auth');


router.get('/:userId', authenticateToken, async (req, res) => {
    try {
        if (req.params.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        let animeList = await AnimeList.findOne({ userId: req.params.userId });
        if (!animeList) {
            animeList = new AnimeList({ userId: req.params.userId });
            await animeList.save();
        }

        res.json(animeList);
    } catch (e) {
        res.status(500).json({ message: 'Error retrieving anime list', error: e.message });
    }
});

// Add an anime to the favorites list of a user
router.post('/:userId/favorites', authenticateToken, async (req, res) => {
    try {
        if (req.params.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        const anime = await Anime.findById(req.body.animeId);
        if (!anime) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        let animeList = await AnimeList.findOne({ userId: req.params.userId });
        if (!animeList) {
            animeList = new AnimeList({ userId: req.params.userId });
            await animeList.save();
        }

        if (animeList.favorites.some(item => item.animeId.toString() === req.body.animeId)) {
            return res.status(400).json({ message: 'Anime is already in the favorites list' });
        }

        animeList.favorites.push({ animeId: req.body.animeId });
        await animeList.save();

        res.json({ message: 'Anime added to favorites successfully', animeList: animeList });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: 'Error adding anime to favorites', error: e.message });
    }
});

// Remove an anime from the favorites list of a user
router.delete('/:userId/favorites/:animeId', authenticateToken, async (req, res) => {
    try {
        if (req.params.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        const animeList = await AnimeList.findOne({ userId: req.params.userId });
        if (!animeList) {
            return res.status(404).json({ message: 'Anime list not found for the user' });
        }

        animeList.favorites = animeList.favorites.filter(item => item.animeId.toString() !== req.params.animeId);
        await animeList.save();

        res.json({ message: 'Anime removed from favorites successfully', animeList: animeList });
    } catch (e) {
        res.status(500).json({ message: 'Error removing anime from favorites', error: e.message });
    }
});

// Add an anime to the toWatch list of a user
router.post('/:userId/toWatch', authenticateToken, async (req, res) => {
    try {
        if (req.params.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        const anime = await Anime.findById(req.body.animeId);
        if (!anime) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        let animeList = await AnimeList.findOne({ userId: req.params.userId });
        if (!animeList) {
            animeList = new AnimeList({ userId: req.params.userId });
            await animeList.save();
        }

        if (animeList.toWatch.some(item => item.animeId.toString() === req.body.animeId)) {
            return res.status(400).json({ message: 'Anime is already in the favorites list' });
        }

        animeList.toWatch.push({ animeId: req.body.animeId });
        await animeList.save();

        res.json({ message: 'Anime added to toWatch successfully', animeList: animeList });
    } catch (e) {
        res.status(500).json({ message: 'Error adding anime to toWatch', error: e.message });
    }
});

// Remove an anime from the toWatch list of a user
router.delete('/:userId/toWatch/:animeId', authenticateToken, async (req, res) => {
    try {
        if (req.params.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        const animeList = await AnimeList.findOne({ userId: req.params.userId });
        if (!animeList) {
            return res.status(404).json({ message: 'Anime list not found for the user' });
        }

        animeList.toWatch = animeList.toWatch.filter(item => item.animeId.toString() !== req.params.animeId);
        await animeList.save();

        res.json({ message: 'Anime removed from toWatch successfully', animeList: animeList });
    } catch (e) {
        res.status(500).json({ message: 'Error removing anime from toWatch', error: e.message });
    }
});

// Add an anime to the watched list of a user
router.post('/:userId/watched', authenticateToken, async (req, res) => {
    try {
        if (req.params.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        const anime = await Anime.findById(req.body.animeId);
        if (!anime) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        let animeList = await AnimeList.findOne({ userId: req.params.userId });
        if (!animeList) {
            animeList = new AnimeList({ userId: req.params.userId });
            await animeList.save();
        }

        if (animeList.watched.some(item => item.animeId.toString() === req.body.animeId)) {
            return res.status(400).json({ message: 'Anime is already in the favorites list' });
        }

        animeList.watched.push({ animeId: req.body.animeId });
        await animeList.save();

        res.json({ message: 'Anime added to watched successfully', animeList: animeList });
    } catch (e) {
        res.status(500).json({ message: 'Error adding anime to watched', error: e.message });
    }
});

// Remove an anime from the watched list of a user
router.delete('/:userId/watched/:animeId', authenticateToken, async (req, res) => {
    try {
        if (req.params.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        const animeList = await AnimeList.findOne({ userId: req.params.userId });
        if (!animeList) {
            return res.status(404).json({ message: 'Anime list not found for the user' });
        }

        animeList.watched = animeList.watched.filter(item => item.animeId.toString() !== req.params.animeId);
        await animeList.save();

        res.json({ message: 'Anime removed from watched successfully', animeList: animeList });
    } catch (e) {
        res.status(500).json({ message: 'Error removing anime from watched', error: e.message });
    }
});

// Add an anime to the abandoned list of a user
router.post('/:userId/abandoned', authenticateToken, async (req, res) => {
    try {
        if (req.params.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        const anime = await Anime.findById(req.body.animeId);
        if (!anime) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        let animeList = await AnimeList.findOne({ userId: req.params.userId });
        if (!animeList) {
            animeList = new AnimeList({ userId: req.params.userId });
            await animeList.save();
        }

        if (animeList.abandoned.some(item => item.animeId.toString() === req.body.animeId)) {
            return res.status(400).json({ message: 'Anime is already in the favorites list' });
        }

        animeList.abandoned.push({ animeId: req.body.animeId });
        await animeList.save();

        res.json({ message: 'Anime added to abandoned successfully', animeList: animeList });
    } catch (e) {
        res.status(500).json({ message: 'Error adding anime to abandoned', error: e.message });
    }
});

// Remove an anime from the abandoned list of a user
router.delete('/:userId/abandoned/:animeId', authenticateToken, async (req, res) => {
    try {
        if (req.params.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        const animeList = await AnimeList.findOne({ userId: req.params.userId });
        if (!animeList) {
            return res.status(404).json({ message: 'Anime list not found for the user' });
        }

        animeList.abandoned = animeList.abandoned.filter(item => item.animeId.toString() !== req.params.animeId);
        await animeList.save();

        res.json({ message: 'Anime removed from abandoned successfully', animeList: animeList });
    } catch (e) {
        res.status(500).json({ message: 'Error removing anime from abandoned', error: e.message });
    }
});


module.exports = router;
