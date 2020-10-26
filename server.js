console.log("Server Start...")
const express = require('express')
const app = express()
const bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({ extended: true}))
app.set('view engine', 'ejs')
app.use('/public', express.static('public'));

const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://sa:200021@cluster0.4l8a9.mongodb.net/DB-CRUD-NODE?retryWrites=true&w=majority"

MongoClient.connect(uri, (err, client) => 
{
  if (err) return console.log(err)
  db = client.db('DB-CRUD-NODE')
  app.listen(3000, () => 
  {
    console.log('Servidor rodando na porta 3000')
  })
})

app.get('/', (req, res) =>
{
  res.render('index');
});

app.post('/', (req, res) => 
{
  db.collection('Users').find({usuario: req.body.usuario}).toArray((err, results) => 
  {
      if (err) return console.log(err)
      dict = results[0]
      if(dict["senha"] == req.body.senha)
      {
        if(dict["tipo"] == 'A')
        {
          db.collection('Tarefas').find().toArray((err, results) => 
          {
              if (err) return console.log(err)
              res.render('crud-tarefas', { data: results })
          })
        }
        else
        {
          db.collection('Tarefas').find().toArray((err, results) => 
          {
            if (err) return console.log(err)
            res.render('lista-tarefas', { data: results })
          })
        }
      }
      else
      {
        res.render("index");
      }
  })
})

app.get('/crud-tarefas', (req, res) => 
{
  console.log("entrei")
  db.collection('Tarefas').find().toArray((err, results) => 
  {
      if (err) return console.log(err)
      res.render('crud-tarefas', { data: results })
  })
})

app.get('/lista-tarefas', (req, res) =>
{
  db.collection('Tarefas').find().toArray((err, results) => 
  {
    if (err) return console.log(err)
    res.render('lista-tarefas', { data: results })
  })
});

app.post('/lista-tarefas', (req, res) => 
{
  db.collection('Users').find({usuario: req.body.usuario}).toArray((err, results) => 
  {
     
  })
})

app.route('/editar-tarefa/:id')
.get((req, res) => {
  var id = req.params.id
  db.collection('Tarefas').updateOne({_id: ObjectId(id)}, 
  {
    $set: 
    {
      nome: req.body.nome,
      descricao: req.body.descricao,
      prioridade: req.body.prioridade,
      arquivo: req.body.arquivo,
      data_cadastro: req.body.data_cadastro,
      data_conclusao: req.body.data_conclusao,
      status: req.body.status
    }
  }, (err, result) => {
    if (err) return res.send(err)
    db.collection('Tarefas').find().toArray((err, results) => 
    {
      if (err) return console.log(err)
      res.render('crud-tarefas', { data: results })
    })
    console.log('Atualizado uma Tarefa no Banco de Dados')
  })
})

app.route('/deletar-tarefa/:id')
.get((req, res) => {
  var id = req.params.id
  db.collection('Tarefas').deleteOne({_id: ObjectId(id)}, (err, result) => 
  {
    if (err) return res.send(500, err)
    console.log('Deletado uma Tarefa do Banco de Dados!')
    db.collection('Tarefas').find().toArray((err, results) => 
    {
      if (err) return console.log(err)
      res.render('crud-tarefas', { data: results })
    })
  })
})

app.post('/cadastrar-tarefa', (req, res)=>
{
  db.collection('Tarefas').save(req.body, (err, result) => 
  {
      if (err) return console.log(err)
      console.log('Salvando uma Tarefa no Banco de Dados')
      db.collection('Tarefas').find().toArray((err, results) => 
      {
        if (err) return console.log(err)
        res.render('crud-tarefas', { data: results })
      })
    })
});

