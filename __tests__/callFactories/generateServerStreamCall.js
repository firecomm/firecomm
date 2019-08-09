const generateServerStreamCall = require("../../lib/callFactories/generateServerStreamCall");
const mockEmit = jest.fn();
const mockServerWritableStream = {
  write: () => {},
  emit: mockEmit,
  request: "fakeMessage",
  metadata: "fakeMetadata"
};
const mockServerWritable = generateServerStreamCall(mockServerWritableStream);

describe("Unit tests for generating Server Stream Call", () => {
  describe("Server Stream should have properties", () => {
    test("Server Stream Call must have head property", () => {
      expect(mockServerWritable.hasOwnProperty("head")).toBe(true);
    });

    test("Server Stream Call must have body property", () => {
      expect(mockServerWritable.hasOwnProperty("body")).toBe(true);
    });
  });

  describe("Server Stream should have methods", () => {
    test("Server Stream Call must have throw method", () => {
      expect(typeof mockServerWritable.throw === "function").toBe(true);
    });

    test("Server Stream Call must have set method", () => {
      expect(typeof mockServerWritable.set === "function").toBe(true);
    });

    test("Server Stream Call must have send method", () => {
      expect(typeof mockServerWritable.send === "function").toBe(true);
    });
    test("Server Stream Call must have on method", () => {
      expect(typeof mockServerWritable.on === "function").toBe(true);
    });
  });

  describe("Server Stream Call should receive message as body", () => {
    test("Server Stream Call should receive message as body", () => {
      expect(mockServerWritable.body === "fakeMessage").toBe(true);
    });

    test("Server Stream Call should receive metadata as head", () => {
      expect(mockServerWritable.head === "fakeMetadata").toBe(true);
    });
  });
});

xdescribe("Server Stream Call should emit error properly", () => {
  it("Emit error now sends grpc.Metadata Object with error property.", () => {
    const mockServerWritable = generateServerStreamCall(
      mockServerWritableStream
    );
    mockServerWritable.setStatus({ test: "test" });
    mockServerWritable.throw(new Error("error"));
    expect(mockEmit.mock.calls[0][1].constructor.name).toBe("Error");
    expect(
      mockEmit.mock.calls[0][1].metadata.hasOwnProperty("_internal_repr")
    ).toBeTruthy();
    expect(mockEmit.mock.calls[0][1].metadata._internal_repr).toEqual({
      test: ["test"]
    });
  });
});
