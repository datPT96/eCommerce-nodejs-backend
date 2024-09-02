const app = require('./src/app')
const {
  app: { port }
} = require('./src/config/config.mongodb')

const PORT = port || 3056

const server = app.listen(PORT, () => {
  console.log(`WSV eComerce start with ${PORT}`)
})

process.on('SIGINT', () => {
  server.close(() => console.log(`Exit server express`))
  // notify.send(ping...)
})
