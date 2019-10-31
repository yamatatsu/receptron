import { Parceptron } from "./Parceptron";
import cdk = require("@aws-cdk/core");

const app = new cdk.App();

new Parceptron(app, "Parceptron", {
  stackName: "Parceptron",
});
