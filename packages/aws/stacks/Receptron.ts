import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import { DynamoEventSource } from "@aws-cdk/aws-lambda-event-sources";
import * as cognito from "@aws-cdk/aws-cognito";

export class Receptron extends cdk.Stack {
  constructor(parent: cdk.App, id: string, props?: cdk.StackProps) {
    super(parent, id, props);

    const { callTable } = defineDBs(this, id);

    const createLambda = lambdaFactory(this, id);
    const healthCheck = createLambda("healthCheck");
    const createCall = createLambda("createCall");
    const callStream = createLambda("callStream");

    callTable.grantWriteData(createCall);

    callStream.addEventSource(
      new DynamoEventSource(callTable, {
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      }),
    );

    const api = new apigateway.RestApi(this, id + "Api", {
      deployOptions: {
        tracingEnabled: true,
      },
    });

    const userPool = new cognito.UserPool(this, id + "UserPool", {});
    new apigateway.CfnAuthorizer(this, id + "CognitoAuthorizer", {
      name: id + "CognitoAuthorizer",
      type: apigateway.AuthorizationType.COGNITO,

      identitySource: "method.request.header.Authorization",
      restApiId: api.restApiId,
      providerArns: [userPool.userPoolArn],
    });

    api.root.addMethod("get", new apigateway.LambdaIntegration(healthCheck));
    const callApi = api.root.addResource("calls", {
      defaultMethodOptions: {
        // authorizer: {
        //   authorizerId: authorizer.ref,
        // },
      },
    });
    callApi.addMethod("post", new apigateway.LambdaIntegration(createCall));
  }
}

const defineDBs = (scope: cdk.Construct, id: string) => {
  const callTable = new dynamodb.Table(scope, id + "CallTable", {
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
  return { callTable };
};

const lambdaFactory = (scope: cdk.Construct, id: string) => {
  const lambdaCode = new lambda.AssetCode("../lambda/dist");
  const moduleCode = new lambda.AssetCode("./layer-dist");
  const moduleLayer = new lambda.LayerVersion(scope, "modules", {
    code: moduleCode,
  });
  return (functionName: string) =>
    new lambda.Function(scope, `${id}-${functionName}`, {
      handler: `index.${functionName}`,
      functionName: `${id}-${functionName}`,
      code: lambdaCode,
      layers: [moduleLayer],
      runtime: lambda.Runtime.NODEJS_10_X,
      tracing: lambda.Tracing.ACTIVE,
    });
};
