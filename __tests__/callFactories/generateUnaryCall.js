const generateUnaryCall = require("../../lib/callFactories/generateUnaryCall");

const fakeCallBack = () => {};
const fakeUnaryCall = { request: "fakeMessage", metadata: "fakeMetadata" };
const mockUnary = generateUnaryCall(fakeUnaryCall, fakeCallBack);
describe("Unit tests for Unary Call", () => {
  describe("Unary should have properties", () => {
    test("Unary Call must have head property", () => {
      expect(mockUnary.hasOwnProperty("head")).toBe(true);
    });

    test("Unary Call must have body property", () => {
      expect(mockUnary.hasOwnProperty("body")).toBe(true);
    });
  });

  describe("Unary should have methods", () => {
    test("Unary Call must have throw method", () => {
      expect(typeof mockUnary.throw === "function").toBe(true);
    });

    test("Unary Call must have set method", () => {
      expect(typeof mockUnary.set === "function").toBe(true);
    });

    test("Unary Call must have on method", () => {
      expect(typeof mockUnary.on === "function").toBe(true);
    });

    test("Unary Call must have send method", () => {
      expect(typeof mockUnary.send === "function").toBe(true);
    });
  });

  describe("Unary should receive message as body", () => {
    test("Unary should receive message as body", () => {
      expect(mockUnary.body === "fakeMessage").toBe(true);
    });

    test("Unary should receive head as metadata", () => {
      expect(mockUnary.head === "fakeMetadata").toBe(true);
    });
  });
});
