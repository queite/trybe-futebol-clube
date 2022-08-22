import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import MatchController from '../controllers/matchController';

const router = Router();

// const matchController = new MatchController();

router.get('/', (req, res) => MatchController.getAll(req, res));
router.post('/', authMiddleware, (req, res) => MatchController.save(req, res));
router.patch('/:id/finish', (req, res) => MatchController.finishMatch(req, res));
router.patch('/:id', (req, res) => MatchController.updateMatch(req, res));

export default router;
