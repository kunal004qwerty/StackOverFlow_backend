import mongoose from 'mongoose'
import config from '../config/index.js'


export default async function dbConnection(){
    try {
        
        console.log(config.DB.DB_URL);
        await mongoose.connect(config.DB.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        // console.clear()

        console.log('Db Connected');

    } catch (error) {
            console.log('Error ====================');
            console.log(error);
            process.exit(1)
    }
}