const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://postgres:PMsa52607984@localhost:5432/yogaretreats'
});

client.connect()
  .then(() => {
    console.log('Connected!');
    return client.end();
  })
  .catch(err => {
    console.error('Connection error:', err);
    client.end();
  });