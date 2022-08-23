import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboardController';

const router = Router();

router.get('/home', (req, res) => LeaderboardController.getResultsHomeTeams(req, res));
router.get('/away', (req, res) => LeaderboardController.getResultsAwayTeams(req, res));
router.get('/', (req, res) => LeaderboardController.getResults(req, res));

export default router;
