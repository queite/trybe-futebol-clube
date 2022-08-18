import { Router } from 'express';
import LoginController from '../controllers/loginController';
import LoginService from '../services/loginService';

const loginService = new LoginService();
const loginController = new LoginController(loginService);

const router = Router();

router.post('/', loginController.login);

export default router;
