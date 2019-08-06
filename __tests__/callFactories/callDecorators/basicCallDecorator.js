const object = {};
const originalCall = {
  hello: "hello"
};
const basicCallDecorator = require("../../../lib/callFactories/callDecorators/basicCallDecorator");

describe("Tests for basicCallDecorator", () => {
  it("Adds call property", () => {
    basicCallDecorator(object, originalCall);
    expect(object.call).toBeTruthy();
  });
  it("Adds state property", () => {
    basicCallDecorator(object, originalCall);
    expect(object.state === null).toBeTruthy();
  });
  it("Adds head property", () => {
    basicCallDecorator(object, originalCall);
    expect(object.hasOwnProperty("head")).toBeTruthy();
  });
});
