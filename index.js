const express = require('express')
const exphbl = require('express-handlebars')
const conn = require('./db/conn')
const User = require('./models/User')
const Address = require('./models/Address')

const app = express()

app.use(
    express.urlencoded({
        extended: true,
    }),
)
app.use(express.json())

app.engine('handlebars', exphbl.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', async (req, res) => {
    const users = await User.findAll({ raw: true });
    res.render('home', { users })
})
// Adiciona novo usuário
app.get('/adduser', async (req, res) => {
    res.render('adduser')
})
// Exclui usuário
app.get('/users/delete/:id', async (req, res) => {
    const id = req.params.id
    const user = await User.destroy({ where: { id: id } })
    res.redirect('/')
})
// Abre formulário de ediçao de usuário
app.get('/users/edit/:id', async (req, res) => {
    const id = req.params.id
    const user = await User.findOne({ include: Address, where: { id: id } })
    res.render('adduser', { user: user.get({ plain: true }) })
})

// Faz o insert ou o update
app.post('/users/save', async (req, res) => {
    const id = req.body.id
    const name = req.body.name
    const occupation = req.body.occupation
    let newsletter = false
    if (req.body.newsletter === 'on') {
        newsletter = true
    }
    if (!id) {
        await User.create({ name, occupation, newsletter })
    } else {
        await User.update({ id, name, occupation, newsletter }, { where: { id: id } })
    }

    res.redirect('/')
})

// Faz o insert ou o update
app.post('/address/save', async (req, res) => {

    const id = req.body.id
    const UserId = req.body.userId
    const street = req.body.street
    const number = req.body.number
    const city = req.body.city

    if (!id) {
        await Address.create({ UserId, street, number, city })
    } else {
        await Address.update({ UserId, street, number, city }, { where: { id: id } })
    }

    res.redirect(`/users/edit/${UserId}`)
})

// Faz o insert ou o update
app.get('/address/delete/:id', async (req, res) => {
    const id = req.params.id
    const address = await Address.findOne({ raw: true, where: { id: id } })

    await Address.destroy({ where: { id: id } })
    res.redirect(`/users/edit/${address.UserId}`)
})

const port = 4000

conn
    .sync()
    .then(() => {
        app.listen(port)
    }).catch((err) => { console.log(err) })
