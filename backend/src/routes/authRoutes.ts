const express = require('express');
const { signup, login } = require('../controllers/auth.controllers');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

export default router;
