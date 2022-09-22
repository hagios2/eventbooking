import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import dotenv from 'dotenv'
dotenv.config()
import connection from './config/db.js'
import schema from './graphql/schema/index.js'
import resolvers from './graphql/resolvers/index.js'

const app = express()

app.use(express.json())

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true
}))

const PORT  = process.env.PORT || 3100

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
    connection()
})