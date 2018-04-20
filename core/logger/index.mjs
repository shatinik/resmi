import Logger from './Logger'

export let log = ( listener ) => {
    if ( !Logger._instance ) {
        Logger._instance = new Logger( listener );
    } else {
      this.listener = listener;
    }
    return Logger._instance;
}

export let safeLogger = ( listener ) => {
    if ( !Logger._safeinstance ) {
        Logger._safeinstance = new Logger( listener, false );
    } else {
        this.listener = listener;
    }  
    return Logger._safeinstance;
}

export default log;