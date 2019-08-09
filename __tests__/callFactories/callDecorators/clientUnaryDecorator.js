const clientUnaryDecorator = require("../../../lib/callFactories/callDecorators/clientUnaryDecorator");

const customCall = {};

const mockOn = jest.fn();
const mockCallback = jest.fn();
const originalCall = {
  hello: "hello",
  request: "request",
  metadata: "metadata",
  on: mockOn
};

clientUnaryDecorator(customCall, originalCall);

describe("tests for client unary decorator", () => {
  describe("basic Tests for method assignment", () => {
    it("should have an on", () => {
      expect(customCall.hasOwnProperty("on")).toBeTruthy();
    });

    it("should assign the body property to be call's request", () => {
      expect(customCall.body).toBe(originalCall.request);
    });

    it("should assign the head to be the metadata", () => {
      expect(customCall.head).toBe(originalCall.metadata);
    });
  });

  describe("tests for on method", () => {
    beforeEach(() => {
      mockOn.mockClear();
      mockCallback.mockClear();
    });
    it("on should accept a data string and callback", () => {
      customCall.on("data", mockCallback);
      expect(mockCallback.mock.calls.length).toBe(1);
    });

    it("should work without a string and just a callback", () => {
      customCall.on(mockCallback);
      expect(mockCallback.mock.calls.length).toBe(1);
    });
  });
});
