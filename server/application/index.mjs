import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import expressSession from 'express-session'

export default class Application {

    get express() { return this.app }
    static get env() { return Application._env }

    static initEnv() {
        let node_env = process.env.NODE_ENV ? process.env.NODE_ENV.toLocaleLowerCase() : '';
        if (!node_env || ( node_env != 'production' && node_env != 'test')) {
            node_env = 'development';
        }
        process.env.NODE_ENV = node_env;
        return Application._env = node_env;
    }

    constructor() {

    }
}