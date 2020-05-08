const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const{title} = request.query;
  //verifica se o titulo do parametro da requisição se inclui no title
  const results = title
       ? repositories.filter(repositorie => repositorie.title.includes(title))
       : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const newRepository = { id: uuid(), title, url, techs, likes:0};

  repositories.push(newRepository);

  return response.status(201).json(newRepository);

});

/*
  PUT: A rota deve alterar apenas o title, 
  a url e as techs do repositório que possua o id igual ao id presente nos parâmetros da rota;
*/
app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs, likes} = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex < 0) {
    return response.status(400).json({error: 'Repositorie not found'});
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  };

  repositories[repositorieIndex] = repository;

  return response.json(repository);


});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex < 0) {
    return response.status(400).json({error: 'Repositorie not found'});
  }
  //remove informação contida nesse indice
  repositories.splice(repositorieIndex, 1);
  
  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({error: 'Repositorie not found'});
  }

  
  const like = ++repositories[repositoryIndex].likes;
  return response.status(201).json({"likes": like});

});

module.exports = app;
