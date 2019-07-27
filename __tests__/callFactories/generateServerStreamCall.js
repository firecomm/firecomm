const generateServerStreamCall = require("../../lib/callFactories/generateServerStreamCall");
const mockEmit = jest.fn();
const mockServerWritableStream = { write: () => {}, emit: mockEmit };
const mockServerWritable = generateServerStreamCall(mockServerWritableStream);

describe("Unit tests for generating Server Stream Call", () => {
  describe("Server Stream should have properties", () => {
    test("Server Stream Call must have metaData property", () => {
      expect(mockServerWritable.hasOwnProperty("metaData")).toBe(true);
    });

    test("Server Stream Call must have req property", () => {
      expect(mockServerWritable.hasOwnProperty("req")).toBe(true);
    });

    test("Server Stream Call req must have meta property", () => {
      expect(mockServerWritable.req.hasOwnProperty("meta")).toBe(true);
    });

    test("Server Stream Call req must have data property", () => {
      expect(mockServerWritable.req.hasOwnProperty("data")).toBe(true);
    });
  });

  describe("Server Stream should have methods", () => {
    test("Server Stream Call must have throw method", () => {
      expect(typeof mockServerWritable.throw === "function").toBe(true);
    });

    test("Server Stream Call must have setMeta method", () => {
      expect(typeof mockServerWritable.sendMeta === "function").toBe(true);
    });

    test("Server Stream Call must have write method", () => {
      expect(typeof mockServerWritable.write === "function").toBe(true);
    });
  });

  describe("ServerStreamCloe has setStatus and sends trailers with errors.", () => {
    beforeAll(() => {
      mockEmit.mockClear();
    });
    it(".setStatus modifies the trailerObject Property", () => {
      const mockServerWritable = generateServerStreamCall(
        mockServerWritableStream
      );
      mockServerWritable.setStatus({ test: "test" });
      expect(mockServerWritable.trailerObject).toEqual({ test: "test" });
    });

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
});
