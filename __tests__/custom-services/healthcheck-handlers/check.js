const checkHandler = require("../../../lib/custom-services/healthcheck-handlers/check");

const _statusMap = {
  service1: "serving",
  service2: "notserving"
};

const mockSend = jest.fn();
const mockThrow = jest.fn();
const mockGetStatus = jest.fn(x => {
  if (!x) {
    return mockServer._statusMap;
  }
  return mockServer._statusMap[x];
});

const mockServer = {
  _statusMap,
  getStatus: mockGetStatus,
  check: checkHandler
};

function callBuilder(payload) {
  return {
    body: payload,
    send: mockSend,
    throw: mockThrow
  };
}

describe("Tests for health check handler", () => {
  beforeEach(() => {
    mockSend.mockClear();
    mockThrow.mockClear();
  });

  it("Passes back whole status map if no services passed", () => {
    mockServer.check(callBuilder({ services: [] }));
    expect(mockSend.mock.calls[0][0].hasOwnProperty("health")).toBeTruthy();
    expect(
      mockSend.mock.calls[0][0]["health"][0].service === "service1" ||
        mockSend.mock.calls[0][0]["health"][0].service === "service2"
    ).toBeTruthy();
  });

  it("uses getStatus method on Server", () => {
    mockServer.check(callBuilder({ services: ["service1"] }));
    expect(mockGetStatus.mock.calls.length).toBeGreaterThanOrEqual(1);
  });

  it("handles if specific service name passed", () => {
    mockServer.check(callBuilder({ services: ["service1"] }));
    expect(mockSend.mock.calls[0][0].hasOwnProperty("health")).toBeTruthy();
    expect(mockSend.mock.calls[0][0]["health"].length).toEqual(1);
  });

  it("emits an error if wrong service name passed", () => {
    mockServer.check(callBuilder({ services: ["service3"] }));
    expect(mockThrow.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});
