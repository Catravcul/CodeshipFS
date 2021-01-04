import 'dotenv/config.js'

const mode = process.env.ENV_MODE

const development = {
    DB: process.env.DATABASE_LOCAL,
    allowedUrls:process.env.DEV_ALLOWED_URLS.split(','),
    codeshipApi: {
        hostname: 'localhost'
    }
}
const test = {
    DB: process.env.DATABASE_LOCAL,
    allowedUrls:process.env.DEV_ALLOWED_URLS.split(','),
    codeshipApi: {
        hostname: 'localhost'
    }
}
const production = {
    DB: process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD),
    allowedUrls:process.env.ALLOWED_URLS.split(','),
    codeshipApi: {
        hostname: 'codeship-api.herokuapp.com'
    }
}

export function getConfig() {
    switch(mode) {
    case "DEV" :
    return getCompleteConfig(development);
    case "TEST" :
    return getCompleteConfig(test);
    default :
    return getCompleteConfig(production);
}}


/**
 * returns config obj with default properties
 * @param {object} config 
 */
function getCompleteConfig(config) {
    return Object.assign(config, {
        mode,
        port: process.env.PORT,
        allowedHeaders:process.env.ALLOWED_HEADERS,
        allowedMethods:process.env.ALLOWED_METHODS
    });
}