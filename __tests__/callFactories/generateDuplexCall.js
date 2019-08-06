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

  describe("Duplex should have properties", () => {
    test("Duplex Call must have head property", () => {
      expect(mockServerReadable.hasOwnProperty("head")).toBe(true);
    });
  });

  describe("Duplex should have methods", () => {
    test("Duplex Call must have throw method", () => {
      expect(typeof mockDuplex.throw === "function").toBe(true);
    });

    test("Duplex Call must have set method", () => {
      expect(typeof mockDuplex.set === "function").toBe(true);
    });

    test("Duplex Call must have on method", () => {
      expect(typeof mockDuplex.on === "function").toBe(true);
    });

    test("Duplex Call must have send method", () => {
      expect(typeof mockDuplex.send === "function").toBe(true);
    });
  });

  xdescribe("Duplex has setStatus and sends trailers with errors.", () => {
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
