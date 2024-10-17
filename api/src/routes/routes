const express = require('express');

const router = express.Router();
const alocacao = require('./controllers/alocacao')
const automoveis = require('./controllers/automoveis')
const clientes = require('./controllers/clientes')
const concessionaria = require('./controllers/concessionaria')

router.get('/', (req, res) => { return res.json("API Jaguar respondendo") });
router.get('/automoveis/:id', automoveis.read);
router.get('/clientes/:id', clientes.read);
router.get('/alocacao/:id', alocacao.read);
router.get('/concessionaria/:id', concessionaria.read);


module.exports = router;