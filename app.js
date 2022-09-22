import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import dotenv from 'dotenv'
dotenv.config()
import connection from './src/config/db.js'

const app = express()

const events = []

app.use(express.json())

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootMutation {
            createEvent(eventInput: EventInput!): Event!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return events
        },
        createEvent: (args) => {
            const { title, description, price } = args.eventInput
        
            const event = {
                _id: Math.random().toString(),
                title,
                description,
                price: +price,
                date: new Date().toISOString()
            }

            events.push(event)

            return event
        }
    },
    graphiql: true
}))

const PORT  = process.env.PORT || 3100

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
    connection()
})