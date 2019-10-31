import cdk = require("@aws-cdk/core");
import apigateway = require("@aws-cdk/aws-apigateway");
import lambda = require("@aws-cdk/aws-lambda");

export class Parceptron extends cdk.Stack {
  constructor(parent: cdk.App, id: string, props?: cdk.StackProps) {
    super(parent, id, props);

    const handler = new lambda.Function(this, "Lambda", {
      code: new lambda.AssetCode("./dist"),
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {},
    });

    const api = new apigateway.RestApi(this, "RestApi");
    const callApi = api.root.addResource("calls", {});
    callApi.addMethod("get", new apigateway.LambdaIntegration(handler));
  }
}
