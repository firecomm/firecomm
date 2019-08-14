const generateClientStreamCall = require("../../lib/callFactories/generateClientStreamCall");
const mockServerReadableStream = { on: () => {} };
const fakeCallback = (err, object, trailer) => {};
const mockServerReadable = generateClientStreamCall(
  mockServerReadableStream,
  fakeCallback
);

describe("Unit tests for generating Client Stream Call", () => {
  describe("Client Stream should have properties", () => {
    test("Client Stream Call must have head property", () => {
      expect(mockServerReadable.hasOwnProperty("head")).toBe(true);
    });
  });

  describe("Client Stream should have methods", () => {
    test("Client Stream Call must have throw method", () => {
      expect(typeof mockServerReadable.throw === "function").toBe(true);
    });

    test("Client Stream Call must have set method", () => {
      expect(typeof mockServerReadable.set === "function").toBe(true);
    });

    test("Client Stream Call must have catch method", () => {
      expect(typeof mockServerReadable.catch === "function").toBe(true);
    });

    test("Client Stream Call must have send method", () => {
      expect(typeof mockServerReadable.send === "function").toBe(true);
    });

    test("Client Stream Call must have on method", () => {
      expect(typeof mockServerReadable.on === "function").toBe(true);
    });
  });
});
