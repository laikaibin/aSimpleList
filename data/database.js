// This is to allow for .env configurations
import dotenv from 'dotenv';
dotenv.config();


// Importing Postgres package
import pkg from 'pg';
const { Client } = pkg;

// Creating the caCert for my SSL certificate
import fs from 'fs';
import path from 'path';

import {URL} from 'url';

// Adjust the path to point to the root directory
const caCertPath = path.join(process.cwd(), 'global-bundle.pem');
const caCert = fs.readFileSync(caCertPath);

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    ca: caCert,
  },
});

client.connect();

export default client;