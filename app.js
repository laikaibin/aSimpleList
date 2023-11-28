import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import ejs from "ejs";

import db from './data/database.js';

const app = express();
const port = 3000;

// const db = new pg.Client({
//   user: "postgres",
//   host: "localhost",
//   database: "database",
//   password: "admin123",
//   port: 5432,
// });

//db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Home Page - Create a new list
app.get('/', (req, res) => {
  res.render('index');
});

// Handle form submission from the home page
app.post('/createList', async (req, res) => {
  const { listName } = req.body;

  // Insert the list name into the database, create URL with listId
  await db.query('INSERT INTO lists(name) VALUES($1) RETURNING id', [listName])
    .then(result => {
      const listId = result.rows[0].id;
      res.redirect(`/lists/${listId}`);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

// List Page - Show the list and allow item submission
app.get('/lists/:id', async (req, res) => {
  const listId = req.params.id;

  // Retrieve the list name and items from the database
  const result = await db.query('SELECT * FROM lists WHERE id = $1', [listId]);
  const list = result.rows[0];

  // Retrieve list items
  const itemsResult = await db.query('SELECT * FROM list_items WHERE list_id = $1', [listId]);
  const items = itemsResult.rows;

  res.render('list', { list, items });
});

// Handle form submission from the list page
app.post('/addItem/:id', async (req, res) => {
  const listId = req.params.id;
  const { listItem } = req.body;

  // Insert the list item into the database
  await db.query('INSERT INTO list_items(list_id, item) VALUES($1, $2)', [listId, listItem])
    .then(() => {
      res.redirect(`/lists/${listId}`);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

app.listen(process.env.PORT || 3000, function () {
  console.log(`Server is running on http://localhost:${port}`);
});