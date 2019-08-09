const Stub = require("./Stub");
const healthcheck = require("./custom-services/healthcheck-pkg");

console.log(healthcheck.HealthCheck);
class HealthStub extends Stub {
  constructor(port) {
    super(healthcheck.HealthCheck, port);
  }
}

module.exports = HealthStub;
