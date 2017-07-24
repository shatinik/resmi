export namespace roomHandler {
    export function getInfo(req, res, next) {
      res.json({
        "kind": process.env.service + '#' + 'room' + 'getInfo' + 'Response',
        "items": []
      });
      next();
    }
}