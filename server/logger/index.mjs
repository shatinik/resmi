import Logger from './Logger'

export let log = ( listener ) => {
    return new Logger( listener );
}

export let safeLogger = ( listener ) => {
    return new Logger( listener, false );
}

export default log;