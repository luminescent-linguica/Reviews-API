const { Client } = require('pg');
const client = new Client({
  host: 'localhost',
  port 5432,
  database: 'SDC'
  user: 'postgres'
});

client.connect()
.then(() => {
  console.log('connected!')
})
.catch((err) => {
  console.log('connection error:', err)
})

const getReviews = (productID) => {
  client.query(`SELECT * FROM Reviews WHERE product_id = ${productID}`)
  .then((result) => {
    console.log('Connected, here are result', result)
  })
  .catch((err) => {
    console.log('Error retreiving', err)
  })
  .then(() => client.end())
}