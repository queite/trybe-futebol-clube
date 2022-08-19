import { Router } from 'express';
import LoginController from '../controllers/loginController';
// import LoginService from '../services/loginService';

// const loginService = new LoginService();
const loginController = new LoginController();

const router = Router();

router.post('/', loginController.login);
router.get('/validate', loginController.validate);

export default router;
