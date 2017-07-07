/*
* TypeScript Class Environment
* Author: sam
* Created: 7.7.17
*/

(function(){
  let node_env = process.env.NODE_ENV ? process.env.NODE_ENV.toLocaleLowerCase() : '';
  if (!node_env || ( node_env != 'production' && node_env != 'test')) {
    process.env.NODE_ENV = 'development';
  }
})();