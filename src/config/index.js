import * as dotenv from 'dotenv'
const result = dotenv.config()

if (result.error) {
    throw result.error
}
console.log(result.parsed);


function getEnvVariable(key) {
    const value = process.env[key]
    if (value && process.env.NODE_ENV !== "prod") {
        const configFile = `./env.${process.env.NODE_ENV}`   // start from index.js file in src folder thats why ./env
        dotenv.config({ path: configFile })
        return value
    } else {
        // dotenv.config()
        throw new Error(`ENVIRONMENT VARIABLE '${key}' NOT SPECIFIED`)
    }
    // you can write elseif(process.env.NODE_ENV == "prod"){
    // 
    // }
}

const config = {
    DB: {
        PORT: getEnvVariable('PORT'),
        DB_URL: getEnvVariable('MONGODB_URI'),
        JWT_APP_SECRET: getEnvVariable('JWT_APP_SECRET'),
        JWT_EXPIRES_IN:getEnvVariable('JWT_EXPIRES_IN')
    }
}

export default config