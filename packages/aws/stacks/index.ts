import { Receptron } from "./Receptron";
import cdk = require("@aws-cdk/core");

const app = new cdk.App();

new Receptron(app, "Receptron", {
  stackName: "Receptron",
});
