import cdk = require("@aws-cdk/core");
import apigateway = require("@aws-cdk/aws-apigateway");
import lambda = require("@aws-cdk/aws-lambda");
import dynamodb = require("@aws-cdk/aws-dynamodb");
import { DynamoEventSource } from "@aws-cdk/aws-lambda-event-sources";

export class Receptron extends cdk.Stack {
  constructor(parent: cdk.App, id: string, props?: cdk.StackProps) {
    super(parent, id, props);

    const callTable = new dynamodb.Table(this, "CallTable", {
      tableName: "Call",
      partitionKey: {
        name: "organizationId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "timestamp",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_IMAGE,
    });

    const code = new lambda.AssetCode("../packages/lambda/dist");
    const createLambda = lambdaFactory(this, code);
    const healthCheck = createLambda("healthCheck");
    const createCall = createLambda("createCall");
    const callStream = createLambda("callStream");

    callStream.addEventSource(
      new DynamoEventSource(callTable, {
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      }),
    );

    const api = new apigateway.RestApi(this, "Receptron");
    api.root.addMethod("get", new apigateway.LambdaIntegration(healthCheck));
    const callApi = api.root.addResource("calls", {});
    callApi.addMethod("post", new apigateway.LambdaIntegration(createCall));
  }
}

const lambdaFactory = (scope: cdk.Construct, code: lambda.Code) => (
  id: string,
) =>
  new lambda.Function(scope, id, {
    handler: `index.${id}`,
    code,
    runtime: lambda.Runtime.NODEJS_10_X,
    environment: {},
  });
