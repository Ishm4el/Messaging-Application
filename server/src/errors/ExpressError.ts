export default class ExpressError extends Error {
  constructor(message: string, name: string, public statusCode: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}
