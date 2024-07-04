const {Schema, model} = require('mongoose');

/* (схема, по которой пользователь будет записан в таблице) */
const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    roles: [{type: String, ref: 'Role'}] /* (подвязываем к схеме Role) */
})

module.exports = model('User', User); /* (экспортируем, передаем название при экспорте и экспортируемую схему, подключаем в authController) */