const duplexCall = require("../../lib/clientCalls/duplexCall");

const mockMethod = jest.fn();
const that = {};
that.methodName = mockMethod;

beforeEach(() => {
  mockMethod.mockClear();
});

describe("Tests for duplexCall.", () => {
  it("Test mock with no args", () => {
    duplexCall(that, "methodName");
    expect(mockMethod.mock.calls.length).toBe(1);
  });

  it("Interceptor array in second position gets called in the right place.", () => {
    duplexCall(that, "methodName", { meta: "value" }, [() => {}]);
    expect(
      typeof mockMethod.mock.calls[0][0].hasOwnProperty("_internal_repr")
    ).toBeTruthy();
    expect(
      mockMethod.mock.calls[0][1].hasOwnProperty("interceptors")
    ).toBeTruthy();
  });

  it("Meta object in the second position gets called in the right place.", () => {
    duplexCall(that, "methodName", [() => {}], { meta: "value" });
    expect(
      typeof mockMethod.mock.calls[0][0].hasOwnProperty("_internal_repr")
    ).toBeTruthy();
    expect(
      mockMethod.mock.calls[0][1].hasOwnProperty("interceptors")
    ).toBeTruthy();
  });
});
