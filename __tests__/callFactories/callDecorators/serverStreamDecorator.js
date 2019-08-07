const basicCallDecorator = require("../../../lib/callFactories/callDecorators/basicCallDecorator");
const serverStreamDecorator = require("../../../lib/callFactories/callDecorators/serverStreamDecorator");

const customCall = {};

const message = { message: "payload" };
const mockEmit = jest.fn();
const mockSendMetadata = jest.fn();
const mockWrite = jest.fn();

const originalCall = {
  hello: "hello",
  emit: mockEmit,
  write: mockWrite,
  sendMetadata: mockSendMetadata
};

basicCallDecorator(customCall, originalCall);
serverStreamDecorator(customCall, originalCall);

describe("server stream decorator tests.", () => {
  beforeEach(() => {
    mockWrite.mockClear();
    mockEmit.mockClear();
    mockSendMetadata.mockClear();
  });
  describe("decorator adds the right methods", () => {
    //adds properties

    it("Has an set property", () => {
      expect(customCall.hasOwnProperty("set")).toBeTruthy();
    });
    it("Has an send property", () => {
      expect(customCall.hasOwnProperty("send")).toBeTruthy();
    });
    it("Has an throw property", () => {
      expect(customCall.hasOwnProperty("throw")).toBeTruthy();
    });
  });

  describe("tests for throw", () => {
    it("throw will throw if not an error", () => {
      expect(() => customCall.throw("fake")).toThrow();
    });
    it("expect it to emit error", () => {
      const fakeError = new Error("fake");
      customCall.throw(fakeError);
      expect(mockEmit.mock.calls[0][0]).toEqual("error");
      expect(mockEmit.mock.calls[0][1]).toBe(fakeError);
    });
  });

  describe("tests for set", () => {
    it("adds a new metadata object", () => {
      const newMetadata = { meta: "data" };
      customCall.set(newMetadata);
      expect(customCall.metadata).toBe(newMetadata);
    });

    it("does not lose metadata properties", () => {
      const oldMeta = { old: "old" };
      const newMeta = { new: "new" };
      customCall.set(oldMeta);
      customCall.set(newMeta);
      expect(customCall.metadata.hasOwnProperty("new")).toBeTruthy();
    });

    it("metadata object overwrites old properties", () => {
      const oldMeta = { old: "old" };
      const newMeta = { old: "new" };
      customCall.set(oldMeta);
      customCall.set(newMeta);
      expect(customCall.metadata.old).toBe("new");
    });
  });

  describe("tests for send", () => {
    it("sends message", () => {
      customCall.send(message);
      expect(mockWrite.mock.calls.length).toBe(1);
    });

    it("sends metadata as grpc metadata object", () => {
      customCall.send(message);
      expect(mockSendMetadata.mock.calls[0][0].constructor.name).toBe(
        "Metadata"
      );
      expect(mockSendMetadata.mock.calls.length).toBe(1);
    });
  });
});
