const Actions = require('../App/configs/Actions');

var _init = false;
var _locked = false;

var tree = [];

function ActToNum() {
    return 1;
}

function _Allowed(req, id) {
    return true;
}

function _Init() {
    return true;
}

module.exports = {

    Init: function () {
        console.log('RBAC initialization in progress...');
        if (!_Init()) {
            _locked = true;
            console.log('RBAC was stopped. Error while initialization. All queries are denied');
            return false;
        }
        _init = true;
        return true;
    },

    Reload: function () {
        _locked = false;
        console.log('Reloading RBAC...');
        tree = [];
        return this.Init();
    },

    Check: function (req, act) {
        if (_locked) {
            return false;
        }
        if (!_init) {
            console.log('RBAC is not initialized');
            if (!this.Init()) {
                return false;
            }
        }
        let id = ActToNum(act);
        if (!id) {
            console.log(`Unknown action ${act}. To fix it add ${act} to Actions.js`);
            return false;
        }
        console.log(`RBAC processing for ${act}`);
        return _Allowed(req, act);
    }
}