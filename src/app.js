const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/**
 * List all repositories
 */
app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

/**
 * Create a new repository
 */
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

/**
 * Update someone repository
 */
app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;

  const { id } = request.params;

  if (!isUuid(id))
    return response.status(400).json({ error: "Invalid ID. (Middleware)" });

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository Not Found!" });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

/**
 * Delete a repository
 */
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "repository not Found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json({ delete: "Successfully" });
});

/**
 * Add a like to someone repository
 */
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(400).json({ error: "repository not Found" });
  }

  repository.likes += 1;

  return response.status(200).json(repository);
});

module.exports = app;
