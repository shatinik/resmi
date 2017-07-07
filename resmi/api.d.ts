declare module api {
  interface requester {
    getRequest(api, method)
    loadConditions(req, res, next, where, title, callback, banQueries)
    query(title, req, res, next, callback, _w)
  }

  export function query(query, req, res, next, callback)
  export function generateApiResult(apiData)
}