require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); /* (для создания токена) */
const {validationResult} = require('express-validator'); /* (для валидации входящих данных) */
const User = require('./models/User');
const Role = require('./models/Role');

const secret = process.env.SECRET_KEY; /* (любое секретное слово для генерации токена) */

/* (функция для генерации токена) */
const generateAccessToken = (id, roles) => {
    const payload = { /* (в обьекте передаем информацию, которую нужно зашифровать) */
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"}); /* (метод sign сгенерирует ключ доступа, зашифрует в него переданную информацию на основе секретного слова, как опции передаем срок действия токена) */
} /* (подключаем в методе login) */

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req); /* (валидируем запрос) */
            if(!errors.isEmpty()) { /* (если есть ошибки - сообщаем) */
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }
            const {username, password} = req.body; /* (деструктурируем данные из запроса) */
            const candidate = await User.findOne({username}); /* (проверяем полученное имя в БД) */
            if (candidate) { /* (если имя уже есть в БД, возвращаем ошибку) */
                return res.status(400).json({message: "Пользователь с таким именем уже зарегистрирован"});
            }
            const hashPassword = bcrypt.hashSync(password, 7); /* (полученный пароль сразу хешируем(кодируем), в БД напрямую не сохраняем в hashSync передаем пароль и количество итераций хеширования - сильно много не рекоммендуется) */
            const userRole = await Role.findOne({value: "USER"}); /* (получаем из БД роль для пользователя) */
            // const userRole = await Role.findOne({value: "ADMIN"});
            const user = new User({username, password: hashPassword, roles: [userRole.value]}); /* (передаем имя, код и роль в переменную) */
            await user.save();  /* (сохраняем в БД) */
            return res.json({message: "Пользователь успешно зарегистрирован"})
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body; /* (деструктурируем данные из запроса) */
            const user = await User.findOne({username});  /* (проверяем полученное имя в БД) */
            if (!user) {
                return res.status(400).json({message: `Пользователь ${username} не найден`});
            }
            const validPassword = bcrypt.compareSync(password, user.password); /* (метод compareSync сравнит пароль, введенный пользователем, с паролем из БД(хешированным)) */
            if (!validPassword) {
                return res.status(400).json({message: `Введен неверный пароль`});
            }
            const token = generateAccessToken(user._id, user.roles); /* (запускаем генерацию токена) */
            return res.json({token}); /* (возвращаем токен на клиента) */
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            // ----------------------
            // const userRole = new Role();
            // const adminRole = new Role({value: "ADMIN"});
            // await userRole.save()
            // await adminRole.save()
            /* (для примера создали пару записей в таблице - через get-запрос сохранили с помощью функции save) */
            // ----------------------
            const users = await User.find(); /* (получаем всех пользователей) */
            res.json(users)
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new authController();