/* (миддлвер для отслеживания авторизации пользователя) */
require('dotenv').config();
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET_KEY;

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") { /* (при методе options запускаем следующий миддлвер) */
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1]; /* (получаем токен из запроса(приходит с указанием типа Bearer, его обрезаем)) */
        if (!token) {
            return res.ststus(403).json({message: "Пользователь не авторизован"});
        }
        const decodedData = jwt.verify(token, secret); /* (verify расшифрует токен(также передаем секретное слово)) */
        req.user = decodedData; /* (добавляем в запрос поле user с расшифрованным токеном) */
        next(); /* (запускаем следующий миддлвер) */
    } catch (e) {
        console.log(e);
        return res.status(403).json({message: "Пользователь не авторизован"})
    }
} /* (понадобится в authRouter.js) */
/* (проверка через postman - при get-запросе в headers нужно добавить поле authorization со значением Bearer токен, иначе не отработает) */