const basicCallDecorator = require("../../../lib/callFactories/callDecorators/basicCallDecorator");
const clientStreamDecorator = require("../../../lib/callFactories/callDecorators/clientStreamDecorator");

const object = {};
const mockOn = jest.fn();
const mockOnWrapper = (...args) => mockOn(...args);
const mockCallback = jest.fn();

const originalCall = {
  hello: "hello",
  on: mockOnWrapper
};

basicCallDecorator(object, originalCall);
clientStreamDecorator(object, originalCall);

describe("Client stream decorator tests.", () => {
  describe("decorator adds the right methods", () => {
    //adds properties
    beforeEach(() => {});
    it("Has an on property", () => {
      expect(object.hasOwnProperty("on")).toBeTruthy();
    });
    it("Has a catch property", () => {
      expect(object.hasOwnProperty("catch")).toBeTruthy();
    });
  });

  describe("on method", () => {
    beforeEach(() => {
      mockOn.mockClear();
      mockCallback.mockClear();
    });
    it("call's on is called with custom call's on", () => {
      object.on(mockCallback);
      expect(mockOn.mock.calls.length).toBe(1);
    });
    it("custom call's on works with no string", () => {
      object.on(mockCallback);
      expect(mockOn.mock.calls.length).toBe(1);
    });
    it("custom call's on works with a string", () => {
      object.on("data", mockCallback);
      expect(mockOn.mock.calls.length).toBe(1);
    });
    it("throws an error if string not data", () => {
      expect(() => {
        object.on("asdf", mockCallback);
        expect(mockOn.mock.calls[0][0]).toBe("asdf");
      });
    });
  });

  describe("catch method", () => {
    const myFun = () => {};
    object.catch(myFun);
    expect(mockOn.mock.calls[0][0]).toEqual("error");
    expect(mockOn.mock.calls[0][1]).toBe(myFun);
  });
});
