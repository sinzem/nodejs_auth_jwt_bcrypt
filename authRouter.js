const Router = require('express');
const router = new Router();
const controller = require('./authController');

/* (создаем маршруты для запросов, добавляем cb-функции из authController) */
router.post("/registration", controller.registration);
router.post("/login", controller.login);
router.get("/users", controller.getUsers);

module.exports = router; /* (подключаем в index.js) */