require('dotenv').config();
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET_KEY;

/* (миддлвер для проверки роли пользователя(массив с ролями, имеющими права доступа(roles), передается при вызове)) */
module.exports = function(roles) {
    return function(req, res, next) {
        if (req.method === "OPTIONS") { /* (при методе options запускаем следующий миддлвер) */
            next();
        }
    
        try {
            const token = req.headers.authorization.split(' ')[1]; /* (получаем токен из запроса(приходит с указанием типа Bearer, его обрезаем)) */
            if (!token) {
                return res.ststus(403).json({message: "Пользователь не авторизован"});
            }
            const {roles: userRoles} = jwt.verify(token, secret); /* (получаем из токена роли пользователя, деструктурируем как userRoles) */
            let hasRole = false; /* (переменная-флаг для проверки) */
            userRoles.forEach(role => { /* (перебираем роли, если есть подходящая, ставим флаг в true) */
                if (roles.includes(role)) {
                    hasRole = true;
                }
            })
            if (!hasRole) { /* (если флага нет, возвращаем ошибку) */
                return res.status(403).json({message: "У вас нет доступа"})
            }
            next(); /* (запускаем следующий миддлвер) */
        } catch (e) {
            console.log(e);
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
    }
} /* (понадобится в authRouter.js) */
/* (проверка через postman - при get-запросе в headers нужно добавить поле authorization со значением Bearer токен, иначе не отработает) */