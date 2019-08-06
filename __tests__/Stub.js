const { Stub } = require("../index");
const grpc = require("grpc");

// assign method... properly gets the method names...

// successfully promisifies a unary

describe("Unit tests for Stub", () => {
  it("Should extend a service definition", () => {
    class mockServiceDef {
      constructor(port, credentials) {}
    }
    mockServiceDef.service = {
      HandlerName: { requestStream: true, responseStream: false }
    };

    const mockPort = "0.0.0.0:3000";
    const stub = Stub(mockServiceDef, mockPort);
    expect(stub instanceof mockServiceDef).toBeTruthy();
  });

  it("Adds a method to stub matching the method handler name on service definition.", () => {
    class mockServiceDef {
      constructor(port, credentials) {}
    }
    mockServiceDef.service = {
      HandlerName: { requestStream: true, responseStream: false }
    };

    const mockPort = "0.0.0.0:3000";
    const stub = Stub(mockServiceDef, mockPort);

    expect(typeof stub.handlerName).toBe("function");
  });

  it("Wraps Duplex.", () => {
    const jestMock = jest.fn(x => x);
    class mockServiceDef {
      constructor(port, credentials) {
        this.HandlerName = jestMock;
        this.HandlerName.requestStream = true;
        this.HandlerName.responseStream = true;
      }
    }

    const HandlerName = jest.fn(x => console.log(x));
    HandlerName.requestStream = true;
    HandlerName.responseStream = true;

    mockServiceDef.service = { HandlerName };

    const mockPort = "0.0.0.0:3000";
    const stub = Stub(mockServiceDef, mockPort);
    stub.handlerName();
    expect(jestMock.mock.calls.length).toBe(1);
  });

  it("Wraps ClientStream.", () => {
    const jestMock = jest.fn(x => x);
    class mockServiceDef {
      constructor(port, credentials) {
        this.HandlerName = jestMock;
        this.HandlerName.requestStream = true;
        this.HandlerName.responseStream = false;
      }
    }

    const HandlerName = jest.fn(x => console.log(x));
    HandlerName.requestStream = true;
    HandlerName.responseStream = false;

    mockServiceDef.service = { HandlerName };

    const mockPort = "0.0.0.0:3000";
    const stub = Stub(mockServiceDef, mockPort);
    stub.handlerName(() => {});
    expect(jestMock.mock.calls.length).toBe(1);
  });

  it("Wraps ServerStream", () => {
    const jestMock = jest.fn(x => x);
    class mockServiceDef {
      constructor(port, credentials) {
        this.HandlerName = jestMock;
        this.HandlerName.requestStream = false;
        this.HandlerName.responseStream = true;
      }
    }

    const HandlerName = jest.fn(x => console.log(x));
    HandlerName.requestStream = false;
    HandlerName.responseStream = true;

    mockServiceDef.service = { HandlerName };

    const mockPort = "0.0.0.0:3000";
    const stub = Stub(mockServiceDef, mockPort);
    stub.handlerName()
    .send({ message: "fakemessage" });
    expect(jestMock.mock.calls.length).toBe(1);
  });
});

describe("Tests for unaryCall", () => {
  const mockHandler = jest.fn();
  mockHandler.requestStream = false;
  mockHandler.responseStream = false;

  beforeEach(() => {
    mockHandler.mockClear();
  });

  it("Works on interceptor call.", () => {
    class mockServiceDef {
      constructor(port, credentials) {}
      HandlerName(...args) {
        mockHandler(...args);
      }
    }
    mockServiceDef.service = {
      HandlerName: mockHandler
    };

    const mockPort = "0.0.0.0:3000";
    const stub = Stub(mockServiceDef, mockPort);
    const result = stub
      .handlerName({ meta: "data" }, [() => {}])
      .send({ message: "hello" })
      .on(res => {})
      .catch(err => {});
    expect(mockHandler.mock.calls.length).toBe(1);
  });
});
