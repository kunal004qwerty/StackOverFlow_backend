import express from 'express'
import App from './services/ExpressApp.js'
import config from './config/index.js'
import dbConnection from './services/DataBase.js'

async function StartServer(){
    const app = express()

    await dbConnection()

    await App(app)

    app.listen(config.DB.PORT,()=>{
        console.log(`App is Runing on PORT http://localhost:${config.DB.PORT}`);
    })


}

StartServer()