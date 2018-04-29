export default class Main {

    constructor() {}

    async moduleConnection(query) {
        let {handler, type, params} = query;
        
        let Module = await import(`./${handler}.mjs`);
        try {
            let module = new Module.default();

            if (params.toString() == '') {
               return await module.getAll(); 
            }     
            else {
                return await module.emergency();
            }       
        } catch (err) {
            console.log(err);
        }
    }
}