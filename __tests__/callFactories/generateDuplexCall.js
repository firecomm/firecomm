const generateDuplexCall = require("../../lib/callFactories/generateDuplex");

const mockEmit = jest.fn();
const mockDuplexStream = {
  on: () => {},
  write: () => {},
  emit: mockEmit
};
const mockDuplex = generateDuplexCall(mockDuplexStream);

describe("Unit test for generating Duplex Call", () => {
  beforeAll(() => {
    mockEmit.mockClear();
  });

  describe("Duplex should have methods", () => {
    test("Duplex Call must have throw method", () => {
      expect(typeof mockDuplex.throw === "function").toBe(true);
    });

    test("Duplex Call must have sendMeta method", () => {
      expect(typeof mockDuplex.sendMeta === "function").toBe(true);
    });

    test("Duplex Call must have on method", () => {
      expect(typeof mockDuplex.on === "function").toBe(true);
    });

    test("Duplex Call must have write method", () => {
      expect(typeof mockDuplex.write === "function").toBe(true);
    });
  });

  describe("Duplex has setStatus and sends trailers with errors.", () => {
    it(".setStatus modifies the trailerObject Property", () => {
      const mockDuplex = generateDuplexCall(mockDuplexStream);
      mockDuplex.setStatus({ test: "test" });
      expect(mockDuplex.trailerObject).toEqual({ test: "test" });
    });

    it("Emit error now sends grpc.Metadata Object with error property.", () => {
      const mockDuplex = generateDuplexCall(mockDuplexStream);
      mockDuplex.setStatus({ test: "test" });
      mockDuplex.throw(new Error("error"));
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
