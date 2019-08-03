const clientStreamCall = require("../../lib/clientCalls/clientStreamCall");

const mockMethod = jest.fn();
const that = {};
that.methodName = mockMethod;

beforeEach(() => {
  mockMethod.mockClear();
});

describe("Tests for clientStreamCall.", () => {
  it("Test mock with no args except for callback", () => {
    clientStreamCall(that, "methodName", () => {});
    expect(mockMethod.mock.calls.length).toBe(1);
  });

  it("Interceptor array in second position gets called in the right place.", () => {
    clientStreamCall(
      that,
      "methodName",
      { meta: "value" },
      [() => {}],
      () => {}
    );
    expect(typeof mockMethod.mock.calls[0][0]).toBe("object");
    expect(
      typeof mockMethod.mock.calls[0][1].hasOwnProperty("intercpetors")
    ).toBeTruthy();
  });

  it("Throws when no callback is supplied.", () => {
    expect(() => {
      clientStreamCall(that, "methodName", { meta: "value" }, [() => {}]);
    }).toThrow();
  });

  it("Meta object in the second position gets called in the right place.", () => {
    clientStreamCall(
      that,
      "methodName",
      [() => {}],
      { meta: "value" },
      () => {}
    );
    expect(typeof mockMethod.mock.calls[0][1]).toBe("object");
    expect(
      typeof mockMethod.mock.calls[0][0].hasOwnProperty("interceptors")
    ).toBeTruthy();
  });
});
