const express = require("express");
const { response } = require("express");
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const SEGREDO = "secreta";

const tarefas = [];

app.get("/", (req, res) => res.send({ message: "ok" }));

app.post("/login", (req, resp) => {
  var body = req.body;
  if (body.username == "usuario" && body.password == "123456") {
    var token = jwt.sign({ username: "usuario", role: "admin" }, SEGREDO, {
      expiresIn: "1h",
    });
    resp.send({ auth: true, token });
  } else {
    resp.status(401).send({ message: "Error in username or password" });
  }
});

app.post("/tasks", (req, res) => {
  console.log("Nova tarefa");
  const body = req.body;
  const tarefa = {
    title: body.title,
    description: body.description,
    isDone: body.isDone || false,
    isPriority: body.isPriority || false,
    id: tarefas.length + 1
  };

  tarefas.push(tarefa);
  res.status(201).send(tarefa);
});

app.get("/tasks", (req, res) => res.status(200).send(tarefas));

app.get("/tasks/:id", (req, res) => {
  const tarefa = tarefas.find((t) => t.id == req.params.id);
  if (tarefa) {
    res.status(200);
    res.send(tarefa);
  } else {
    res.status(404);
    res.send();
  }
});

app.put("/tasks/:id", (request, response) => {
  const body = request.body;
  const tarefa = tarefas.find((t) => t.id == request.params.id);

  if (tarefa) {
    tarefa.title = body.title;
    tarefa.description = body.description;
    tarefa.isDone = true;
    tarefa.isPriority = body.isPriority;
    response.send(tarefa);
  } else {
    response.status(404);
    response.send();
  }
});

app.get("/tasks/:id", (req, res) => {
    const tarefa = tarefas.find((t) => t.id == req.params.id);
    if (tarefa) {
      res.status(200);
      res.send(tarefa);
    } else {
      res.status(404);
      res.send();
    }
});

app.delete("/tasks/:tarefaId", (request, response) => {
  const tarefa = tarefas.find((t) => t.id == request.params.tarefaId);
  if (tarefa) {
    const index = tarefas.indexOf(tarefa);
    const tarefaDeleted = tarefas.splice(index, 1);
    response.status(200)
    response.send(tarefaDeleted);
  } else {
    response.status(404);
    response.send();
  }
});

app.get("/tasks", (req, res) => res.status(200).send(tarefas));

app.listen(3000, () => console.log("Server rodando na porta 3000"));
