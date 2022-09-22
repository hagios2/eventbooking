import { Event } from '../../models/Event.js'
import { User } from '../../models/User.js'
import bcrypt from 'bcrypt'

const resolvers = {
    events: async () => {
        let events = await Event.find().populate('creator')
        
        return events.map(event => {     
            return {
                _id: event._id,
                title: event.title,
                description: event.description,
                price: event.price,
                date: new Date(event.date).toISOString(),
                creator: event.creator
            }
        })
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

            event.date = new Date(event.date).toISOString()

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
}

export default resolvers