import 'dotenv/config.js'

const mode = process.env.ENV_MODE

const development = {
    mode,
    codeshipApi: {
        hostname: 'localhost'
    }
}
const test = {
    mode,
    codeshipApi: {
        hostname: 'localhost'
    }
}
const production = {
    mode,
    codeshipApi: {
        hostname: 'codeship-api.herokuapp.com'
    }
}

export function getConfig() {
    switch(mode) {
    case "DEV" :
    return development;
    case "TEST" :
    return test;
    default :
    return production;
}}