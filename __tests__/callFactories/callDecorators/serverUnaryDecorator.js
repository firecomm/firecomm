const object = {};
const originalCall = {
  hello: "hello"
};
const serverUnaryDecorator = require("../../../lib/callFactories/callDecorators/serverUnaryDecorator");

describe("Server unary decorator tests.", () => {
  describe("decorator adds the right methods", () => {
    //adds properties
    beforeEach(() => {
      serverUnaryDecorator(object, originalCall);
    });
    it("Has an on property", () => {
      expect(object.hasOwnProperty("set")).toBeTruthy();
    });
    it("Has a catch property", () => {
      expect(object.hasOwnProperty("send")).toBeTruthy();
    });
    it("Has a throw property", () => {
      expect(object.hasOwnProperty("throw")).toBeTruthy();
    });
  });
});
