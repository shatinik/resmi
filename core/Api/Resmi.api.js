const Nconf = require('nconf');

const Apis = {
	getByEnumID: require('./Resmi.api.getByEnumID')
};

module.exports.call = function(req, res, next, apiTitle) {
	
	Nconf.env().argv();
	var apiConfig = Nconf.file({ file: `./App/configs/api.json` });
	
	Apis[apiConfig.get(apiTitle).apiType](req, res, next, apiConfig.get(apiTitle));
};