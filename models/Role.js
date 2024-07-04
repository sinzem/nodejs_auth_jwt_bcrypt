const {Schema, model} = require('mongoose');

/* (схема, по которой роль пользователя будет записана в таблице) */
const Role = new Schema({
    value: {type: String, unique: true, default: "USER"}
})

module.exports = model('Role', Role); /* (экспортируем, передаем название при экспорте и экспортируемую схему, подключаем в authController) */