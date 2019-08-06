const object = {};
const originalCall = {
  hello: "hello"
};
const clientUnaryDecorator = require("../../../lib/callFactories/callDecorators/clientUnaryDecorator");

describe("Client unary decorator tests.", () => {
  describe("decorator adds the right methods", () => {
    //adds properties
    beforeEach(() => {
      clientUnaryDecorator(object, originalCall);
    });
    it("Has an on property", () => {
      expect(object.hasOwnProperty("on")).toBeTruthy();
    });
  });
});
