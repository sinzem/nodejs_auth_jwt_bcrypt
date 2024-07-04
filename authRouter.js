const Router = require('express');
const {check} = require('express-validator'); /* (миддлвер для валидации входящих данных) */
const router = new Router();
const controller = require('./authController');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');

/* (создаем маршруты для запросов, добавляем cb-функции из authController) */
router.post("/registration", [
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть от 4 до 10 символов").isLength({min:4, max:10}) /* (массивом передаем миддлверы для валидации данных) */
], controller.registration);
router.post("/login", controller.login);
router.get("/users", /* authMiddleware */roleMiddleware(['ADMIN']), controller.getUsers); /* (при запросе передаем миддлвер для проверки доступа, в него передаем массив с ролями, у которых есть доступ(миддлвер authMiddleware для валидации зарегистрированных пользователей)) */

module.exports = router; /* (подключаем в index.js) */