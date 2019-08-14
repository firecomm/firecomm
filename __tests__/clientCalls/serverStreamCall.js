const serverStreamCall = require("../../lib/clientCalls/serverStreamCall");

const mockMethod = jest.fn();
const that = {};
that.methodName = mockMethod;

beforeEach(() => {
  mockMethod.mockClear();
});

describe("Tests for serverStreamCall.", () => {
  xit("Should throw when no message is supplied", () => {
    expect(() => {
      serverStreamCall(that, "methodName");
    }).toThrow();
  });

  xit("Test mock with no args except for message.", () => {
    serverStreamCall(that, "methodName", { message: "Hello" });
    expect(mockMethod.mock.calls.length).toBe(1);
  });

  xit("Interceptor array in third position gets called in the right place.", () => {
    serverStreamCall(
      that,
      "methodName",
      { message: "hello" },
      { meta: "value" },
      [() => {}],
      () => {}
    );
    expect(
      typeof mockMethod.mock.calls[0][1].hasOwnProperty("_internal_repr")
    ).toBeTruthy();
    expect(
      mockMethod.mock.calls[0][2].hasOwnProperty("interceptors")
    ).toBeTruthy();
  });

  xit("Meta object in the second position gets called in the right place.", () => {
    serverStreamCall(that, "methodName", { message: "hello" }, [() => {}], {
      meta: "value"
    });
    expect(
      typeof mockMethod.mock.calls[0][1].hasOwnProperty("_internal_repr")
    ).toBeTruthy();
    expect(mockMethod.mock.calls[0][0].hasOwnProperty("message")).toBeTruthy();
  });
});
