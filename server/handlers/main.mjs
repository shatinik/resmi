import logger       from '../logger'

const log = logger('system');

export default class Main {

    constructor() {}

    async moduleConnection(query) {
        let {handler, method, type, params} = query;
        let Module = await import (`./${handler}.mjs`);

        try {
            let module = new Module.default();
            return await module.mapping(method, params);
        } catch (err) {
            log.error(err);
        }
    }
}