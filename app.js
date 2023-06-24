const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;
const initalizeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server started");
    });
  } catch (e) {
    console.log(`Db Error ${e.message}`);
    process.exit(1);
  }
};

initalizeDbAndServer();

//api-1

app.get("/todos/", async (request, response) => {
  const { status, priority, search_q = "" } = request.query;
  let query = ``;
  switch (true) {
    case status !== undefined && priority !== undefined:
      query = `
                select * from todo
                where status = '${status}' and priority = '${priority}' and todo LIKE '%${search_q}%';
            `;
      break;
    case status !== undefined:
      query = `
                select * from todo
                where status = '${status}' and todo LIKE '%${search_q}%';
            `;
      break;
    case priority !== undefined:
      query = `
                select * from todo 
                where priority = '${priority}' and todo LIKE '%${search_q}%';
            `;
      break;
    default:
      query = `
                select * from todo
                where todo LIKE '%${search_q}%';
            `;
  }
  const dbResponse = await db.all(query);
  response.send(dbResponse);
});

//api-2

app.get("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const query = `
        select  * from todo 
        where id = '${todoId}';
    `;
  const dbResponse = await db.get(query);
  response.send(dbResponse);
});

//api-3

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  console.log(request.body);
});

//api-4

app.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const details = request.body;
  const { status, priority, todo } = details;
  console.log(details);
});

//api-5
app.delete("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const query = `
        delete from todo where id = '${todoId}';
    `;
  const dbResponse = await db.run(query);
  response.send("Todo Deleted");
});

module.exports = app;
