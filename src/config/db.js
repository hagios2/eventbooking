import mongoose from 'mongoose'

const connection =  async () => {

    try{
        const url = process.env.DB_URL

        mongoose.connect(`${url}`, {useNewUrlParser: true})

        mongoose.connection.once('open', () => {
            console.log('connection with monogo established successfully')
        })

    }catch (error){
        console.log(error)
    }
}

export default connection