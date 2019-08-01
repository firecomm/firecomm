const generateServerStreamCall = require('../../lib/callFactories/generateServerStreamCall')
const mockEmit = jest.fn();
const mockServerWritableStream = { write: () => {}, emit: mockEmit, request: 'fakeMessage', metadata: 'fakeMetadata'};
const mockServerWritable = generateServerStreamCall(mockServerWritableStream);

describe("Unit tests for generating Server Stream Call", () => {
  describe("Server Stream should have properties", () => {
    test("Server Stream Call must have metaData property", () => {
      expect(mockServerWritable.hasOwnProperty("metaData")).toBe(true);
    });

    test('Server Stream Call must have metadata property', () => {
      expect(mockServerWritable.hasOwnProperty('metadata')).toBe(true);
    })

    test('Server Stream Call must have body property', () => {
      expect(mockServerWritable.hasOwnProperty('body')).toBe(true);
    })
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

    test('Server Stream Call must have write method', () => {
      expect(typeof mockServerWritable.write === 'function').toBe(true);
    })
  })

  describe('Server Stream Call should receive message as body', () => {

    test('Server Stream Call should receive message as body', () => {
      expect(mockServerWritable.body === 'fakeMessage').toBe(true);
    })

    test('Server Stream Call should receive metadata as metadata', () => {
      expect(mockServerWritable.metadata === 'fakeMetadata').toBe(true);
    })

  })
})
describe('Server Stream Call should emit error properly', () => {
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
