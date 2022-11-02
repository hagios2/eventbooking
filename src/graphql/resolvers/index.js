import { Event } from '../../models/Event.js'
import { User } from '../../models/User.js'
import { Booking } from '../../models/Booking.js'
import bcrypt from 'bcrypt'

const user = async userId => {
    try {
      const user = await User.findById(userId);
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: resolvers.events.bind(this, user._doc.createdEvents)
      };
    } catch (err) {
      throw err;
    }
}

const singleEvent = async eventId => {
    try {
      const event = await Event.findById(eventId);
      return {
        ...event._doc,
        _id: event.id,
        creator: user.bind(this, event.creator)
      };
    } catch (err) {
      throw err;
    }
  };
  
const resolvers = {
    events: async () => {
        let events = await Event.find().populate('creator')
        
        return events.map(event => {     
            return {
                ...event._doc,
                _id: event._id,
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
            event.populate('creator')

            return {
                ...event._doc,
                _id: event._id,
                date: new Date(event.date).toISOString(),
                creator : creator.populate('createdEvents')
            }
        } catch (err) {
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
    },
    bookings: async (args) => {
        try {
            const bookings = await Booking.find()

            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    _id: booking.id,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                }
            })
        } catch (err) {
            throw err
        }
    },
    createBooking: async () => {
        try {
            const bookings = await Booking.find()

            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    _id: booking.id,
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                }
            })
        } catch (err) {
            throw err
        }
    },
    bookEvent: async args => {
        const event = await Event.findOne({_id: args.eventId})
        const booking = new Booking({
            user: '632bff8c6a20edd9bf989287',
            event
        })

        const result = await booking.save()
        return { 
            ...result._doc,
            _id: result.id,
            user: user.bind(this, booking._doc.user),
            event: singleEvent.bind(this, booking._doc.event),
            createdAt:new Date(result._doc.createdAt).toISOString(),
            updatedAt:new Date(result._doc.updatedAt).toISOString()
        }
    },
    cancelBooking: async args => {
        const booking = await Booking.findById({_id: args.bookingId}).populate('event')
        const event = {...booking.event, _id: booking.event.id, creator: user.bind(this, booking.creator)}
        await Booking.deleteOne({_id: args.bookingId})
        return event
    }
}

export default resolvers