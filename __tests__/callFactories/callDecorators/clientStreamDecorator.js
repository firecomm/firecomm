const object = {};
const originalCall = {
  hello: "hello"
};
const clientStreamDecorator = require("../../../lib/callFactories/callDecorators/clientStreamDecorator");

describe("Client stream decorator tests.", () => {
  describe("decorator adds the right methods", () => {
    //adds properties
    beforeEach(() => {
      clientStreamDecorator(object, originalCall);
    });
    it("Has an on property", () => {
      expect(object.hasOwnProperty("on")).toBeTruthy();
    });
    it("Has a catch property", () => {
      expect(object.hasOwnProperty("catch")).toBeTruthy();
    });
  });
});
