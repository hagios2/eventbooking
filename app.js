import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import dotenv from 'dotenv'
dotenv.config()
import connection from './src/config/db.js'
import { Event } from './src/models/Event.js'

const app = express()

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
        events: async () => {
            return await Event.find()
        },
        createEvent: async (args) => {
            const { title, description, price, date } = args.eventInput
        
            try {
                const event = new Event({
                    title,
                    description,
                    price,
                    date: new Date(date)
                })
                
                await event.save()

                return event

            } catch (err) {
                console.log(err)
                throw err
            }
        }
    },
    graphiql: true
}))

const PORT  = process.env.PORT || 3100

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
    connection()
})