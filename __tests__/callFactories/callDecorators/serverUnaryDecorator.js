const object = {};

const mockSendCalback = jest.fn();
const mockSendMetadata = jest.fn();

const originalCall = {
  hello: "hello",
  sendMetadata: mockSendMetadata
};

const basicCallDecorator = require("../../../lib/callFactories/callDecorators/basicCallDecorator");
const serverUnaryDecorator = require("../../../lib/callFactories/callDecorators/serverUnaryDecorator");

basicCallDecorator(object, originalCall);
serverUnaryDecorator(object, mockSendCalback);

describe("Server unary decorator tests.", () => {
  beforeEach(() => {
    mockSendCalback.mockClear();
  });

  xdescribe("decorator adds the right methods", () => {
    //adds properties
    beforeEach(() => {
      serverUnaryDecorator(object, originalCall);
    });
    it("Has an on property", () => {
      expect(object.hasOwnProperty("set")).toBeTruthy();
    });
    it("Has a catch property", () => {
      expect(object.hasOwnProperty("send")).toBeTruthy();
    });
    it("Has a throw property", () => {
      expect(object.hasOwnProperty("throw")).toBeTruthy();
    });
  });

  xdescribe("Tests for throw method", () => {
    it("Expect throw to throw if not type error passed.", () => {
      const fakeError = "hello";
      expect(() => {
        object.throw(fakeError);
      }).toThrow();
    });

    it("Throw passes error into sendCallback", () => {
      const fakeError = new Error("fake error");
      object.throw(fakeError);
      expect(mockSendCalback.mock.calls[0][0] instanceof Error).toBeTruthy();
    });
  });

  xdescribe("Tests for send method", () => {
    it("Passes send message into the send callback as the second parameter.", () => {
      const fakeMessage = { message: "hello" };
      object.send(fakeMessage);
      expect(
        mockSendCalback.mock.calls[0][1].hasOwnProperty("message")
      ).toBeTruthy();
    });
  });

  describe("Tests for set method", () => {
    it("Adds new properties to the metadata object", () => {
      const fakeMetadata = { message: "hello" };
      object.set(fakeMetadata);
      object.send({ fakemessage: "fakemessage" });
      expect(object.metadata.hasOwnProperty("message")).toBeTruthy();
    });
  });

  describe("Tests for metadata passing", () => {
    xit("Passes send message into the send callback as the second parameter.", () => {
      const fakeMetadata = { message: "hello" };
      object.set(fakeMetadata);
      object.send({ fakemessage: "fakemessage" });
      expect(
        mockSendMetadata.mock.calls[0][0].hasOwnProperty("message")
      ).toBeTruthy();
    });
  });
});
