export namespace Events {
  export function before(req, res, next) {
    let somethingWentWrong = false;
    if (somethingWentWrong) {
      this.accessDenied(req, res);
      return;
    }
    next();
  }

  export function after(req, res, next) {
    next();
  }

  export function accessDenied(req, res) {
    res.send('access denied');
  }
}