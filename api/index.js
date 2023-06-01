const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db = mysql.createConnection({
  host: "mysql_srv",
  user: "root",
  password: "root",
  database: "todosdb",
});

db.connect((err) => {
  if (err) {
    console.log("connection failed", err);
  } else {
    console.log("connected");

    let query = `CREATE TABLE todos_table
        (id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL, completed TINYINT NOT NULL
        )`;

    db.query(query, (err, rows) => {
      if (err) {
        console.log("Table Exist");
      } else {
        console.log(`Successfully Created Table`);
      }
    });
  }
});

app.get("/", (req, res) => {
  res.json("Testing Node.js Server");
});

app.get("/api/todos", (req, res) => {
  db.query("SELECT * from todos_table", (err, result) => {
    res.send(result);
  });
});

app.post("/api/todos", (req, res) => {
  const { title, completed } = req.body;
  console.log("title, completed", title, completed);
  const sqlInsert = "INSERT INTO todos_table(title, completed) VALUES(?,?)";
  db.query(sqlInsert, [title, completed], (error, result) => {
    if (error) console.log(error);
    res.json({ id: result.insertId, title, completed });
  });
});

app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM todos_table WHERE id=?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) console.log(error);
    res.json({ deleted: result.affectedRows });
  });
});

app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const sqlUpdate = "UPDATE todos_table SET title= ?, completed= ? WHERE id=?";
  db.query(sqlUpdate, [title, completed, id], (err, result) => {
    if (err) console.log(err);
    res.json({ updated: result.affectedRows });
  });
});

app.listen(8000, () => {
  console.log("Server is running on port 3306");
});
