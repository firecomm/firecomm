const object = {};
const originalCall = {
  hello: "hello"
};
const clientUnaryDecorator = require("../../../lib/callFactories/callDecorators/clientUnaryDecorator");

describe("tests for client unary decorator", () => {
  describe("basic Tests for method assignment", () => {
    beforeEach(() => {
      clientUnaryDecorator(object, () => {});
    });
    it("should have an on", () => {
      expect(object.hasOwnProperty("on")).toBeTruthy();
    });
  });
});
