const object = {};
const originalCall = {
  hello: "hello"
};
const serverStreamDecorator = require("../../../lib/callFactories/callDecorators/serverStreamDecorator");

describe("server stream decorator tests.", () => {
  describe("decorator adds the right methods", () => {
    //adds properties
    beforeEach(() => {
      serverStreamDecorator(object, originalCall);
    });
    it("Has an set property", () => {
      expect(object.hasOwnProperty("set")).toBeTruthy();
    });
    it("Has an send property", () => {
      expect(object.hasOwnProperty("send")).toBeTruthy();
    });
    it("Has an throw property", () => {
      expect(object.hasOwnProperty("throw")).toBeTruthy();
    });
  });
});
