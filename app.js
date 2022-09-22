import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
dotenv.config()
import connection from './src/config/db.js'
import { Event } from './src/models/Event.js'
import { User } from './src/models/User.js'

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

        type User {
            _id: ID!
            name: String!
            email: String!
            password: String
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

        input UserInput {
            name: String!
            email: String!
            password: String!
        }

        type RootMutation {
            createEvent(eventInput: EventInput!): Event!
            createUser(userInput: UserInput): User!
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
                    date: new Date(date),
                    creator: '632c00089dc979db1a73e5d5'
                })

                await event.save()

                const creator = await User.findById('632c00089dc979db1a73e5d5')
                creator.createdEvents.push(event)
                await creator.save()

                return event.populate('creator')

            } catch (err) {
                console.log(err)
                throw err
            }
        },
        createUser: async (args) => {
            const { name, email, password } = args.userInput

            const existingUser = await User.findOne({ email })
            console.log(existingUser)

            if (existingUser) {
                throw new Error('Email already exists')
            }

            const hashedPassword = await bcrypt.hash(password, 12)
        
            try {
                const user = new User({
                    name,
                    email,
                    password: hashedPassword,
                })
                
                await user.save()

                user.password = null

                return user

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