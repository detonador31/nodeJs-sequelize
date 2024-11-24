const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('nodemysql2', 'root', '123456', {
    host: '127.0.0.1',
    dialect: 'mysql'
})

// try {
//     sequelize.authenticate()
//     console.log('Banco de dados conectado com sucesso!')
// } catch (err) {
//     console.log('Erro ao tentar conectar ao banco de dados! ' + err)
// }

module.exports = sequelize