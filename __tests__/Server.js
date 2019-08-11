const grpc = require("grpc");
const path = require("path");
const protoLoader = require("@grpc/proto-loader");

const { Server } = require("../index");
var PROTO_PATH = path.join(__dirname, "./test.proto");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// console.log(Object.keys(protoDescriptor));
var testProto = protoDescriptor.test;

const testService = testProto.Test;

testService._serviceName = "Test";

xdescribe("Unit tests for Server", () => {
  it("Constructor extends the grpc server class.", () => {
    const server = new Server();
    expect(server instanceof grpc.Server).toBeTruthy();
  });

  it("Server bind throws an error when you pass in an object as a port.", () => {
    expect(() => {
      const server = new Server();
      server.bind({ port: "0.0.0.0:3000" });
    }).toThrow();
  });

  it("addService composes and adds an async function.", () => {
    const server = new Server();
    server.addService(testService, {
      unaryCall: jest.fn(function() {})
    });
    expect(
      server.handlers[Object.keys(server.handlers)[0]].func.constructor.name
    ).toBe("AsyncFunction");
  });

  it("addService throws an error when you add a handlername not included in the service.", () => {
    const server = new Server();
    expect(() => {
      server.addService(testService, {
        unaryCatz: jest.fn(function() {})
      });
    }).toThrow();
  });

  it("addService composes a service level middleware function that gets called when you call the handler.", () => {
    const server = new Server();
    const mockMiddleware = jest.fn(function() {});
    server.addService(
      testService,
      {
        unaryCall: jest.fn(function() {})
      },
      mockMiddleware
    );
    const fakeObject = {};
    server.handlers[Object.keys(server.handlers)[0]].func(fakeObject);
    expect(mockMiddleware.mock.calls.length).toBe(1);
  });

  it("addService composes a method level middleware that is called on context object when handler is called.", () => {
    const server = new Server();
    const mockMiddleware = jest.fn();
    server.addService(testService, {
      unaryCall: [mockMiddleware]
    });
    const fakeObject = {};
    server.handlers[Object.keys(server.handlers)[0]].func(fakeObject);
    expect(mockMiddleware.mock.calls.length).toBe(1);
  });
});

xdescribe("Unit tests for bind.", () => {
  it("Bind should support a single port insecurely if no config supplied.", () => {
    const server = new Server();
    const boundPorts = server.bind("0.0.0.0:3000");
    expect(boundPorts[0]).toBeGreaterThanOrEqual(0);
  });
});

xdescribe("Uncaught Error Handling.", () => {
  it("Server level error handling should receive error and context object", () => {
    const mockErrorHandler = jest.fn();
    const server = new Server(mockErrorHandler);
    const mockMiddleware = jest.fn((err, call) => {
      throw new Error("error from mock middleware");
    });
    server.addService(testService, {
      unaryCall: [mockMiddleware]
    });
    const fakeObject = {};
    server.handlers[Object.keys(server.handlers)[0]].func(fakeObject);
    expect(mockErrorHandler.mock.calls.length).toBe(1);
    expect(mockErrorHandler.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(typeof mockErrorHandler.mock.calls[0][1] === "object").toBeTruthy();
  });

  it("Service level error handlers overwrite server level error handlers", () => {
    const mockErrorHandler = jest.fn();
    const server = new Server(jest.fn());
    const mockMiddleware = jest.fn((err, call) => {
      throw new Error("error from mock middleware");
    });
    server.addService(
      testService,
      {
        unaryCall: [mockMiddleware]
      },
      null,
      mockErrorHandler
    );
    const fakeObject = {};
    server.handlers[Object.keys(server.handlers)[0]].func(fakeObject);
    expect(mockErrorHandler.mock.calls.length).toBe(1);
    expect(mockErrorHandler.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(typeof mockErrorHandler.mock.calls[0][1] === "object").toBeTruthy();
  });
});

describe("Server tests for health check", () => {
  const server = new Server();

  it("Has a health check Service.", () => {});

  it("getStatus method returns the full status map if not passed params", () => {});

  it("getStatus method returns null if passed wrong params", () => {});

  it("getStatus method returns specific status if one provided", () => {});

  it("setStatus method alters status map", () => {});

  it("Server adds health check to statusmap automatically", () => {});
});
