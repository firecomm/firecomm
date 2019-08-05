const object = {};
const originalCall = {
  hello: "hello"
};
const addStateAndCallDecorator = require("../../../lib/callFactories/callDecorators/addStateAndCallDecorator");

describe("Tests for addStateAndCallDecorator", () => {
  it("Adds call property", () => {
    addStateAndCallDecorator(object, originalCall);
    expect(object.call).toBeTruthy();
  });
  it("Adds state property", () => {
    addStateAndCallDecorator(object, originalCall);
    expect(object.state === null).toBeTruthy();
  });
});
