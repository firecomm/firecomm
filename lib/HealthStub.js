const Stub = require("./Stub");
const healthcheck = require("./custom-services/healthcheck-pkg");

class HealthStub extends HealthStub() {
  constructor(port) {
    super(healthcheck.HealthCheck, port);
  }
}

module.exports = HealthStub;
