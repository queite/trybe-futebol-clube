import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import MatchFactory from '../factories/MatchFactory';

const router = Router();

const matchController = MatchFactory.make();

router.get('/', (req, res) => matchController.getAll(req, res));
router.post('/', authMiddleware, (req, res) => matchController.save(req, res));
router.patch('/:id/finish', (req, res) => matchController.finishMatch(req, res));
router.patch('/:id', (req, res) => matchController.updateMatch(req, res));

export default router;
