const object = {};

const mockSendCalback = jest.fn();
const mockSendMetadata = jest.fn();

const originalCall = {
  hello: "hello",
  sendMetadata: mockSendMetadata
};

const serverUnaryDecorator = require("../../../lib/callFactories/callDecorators/serverUnaryDecorator");

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
      serverUnaryDecorator(object, mockSendCalback);
      const fakeError = "hello";
      expect(() => {
        object.throw(fakeError);
      }).toThrow();
    });

    it("Throw passes error into sendCallback", () => {
      serverUnaryDecorator(object, mockSendCalback);
      const fakeError = new Error("fake error");
      object.throw(fakeError);
      expect(mockSendCalback.mock.calls[0][0] instanceof Error).toBeTruthy();
    });
  });

  xdescribe("Tests for send method", () => {
    it("Passes send message into the send callback as the second parameter.", () => {
      serverUnaryDecorator(object, mockSendCalback);
      const fakeMessage = { message: "hello" };
      object.send(fakeMessage);
      expect(
        mockSendCalback.mock.calls[0][1].hasOwnProperty("message")
      ).toBeTruthy();
    });
  });

  describe("Tests for set method", () => {
    it("Adds new properties to the metadata object", () => {
      serverUnaryDecorator(object, mockSendCalback);
      const fakeMetadata = { message: "hello" };
      object.set(fakeMetadata);
      expect(
        mockSendCalback.mock.calls[0][1].hasOwnProperty("message")
      ).toBeTruthy();
    });
  });

  describe("Tests for metadata passing", () => {
    it("Passes send message into the send callback as the second parameter.", () => {
      // add metadata to the call with set
      //send
      //check if send metadata was called
      // serverUnaryDecorator(object, mockSendCalback);
      // const fakeMessage = { message: "hello" };
      // object.send(fakeMessage);
      // expect(
      //   mockSendCalback.mock.calls[0][1].hasOwnProperty("message")
      // ).toBeTruthy();
    });
  });
});
