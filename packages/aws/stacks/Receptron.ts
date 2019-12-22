import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import { DynamoEventSource } from "@aws-cdk/aws-lambda-event-sources";
import * as cognito from "@aws-cdk/aws-cognito";

import { defineDBs } from "./dynamodb";

export class Receptron extends cdk.Stack {
  constructor(parent: cdk.App, id: string, props?: cdk.StackProps) {
    super(parent, id, props);

    const { orgEventTable, accountTable, callTable } = defineDBs(this, id);

    const createLambda = lambdaFactory(this, id);
    const healthCheck = createLambda("healthCheck");
    const createOrgEvent = createLambda("createOrgEvent");
    const getAccount = createLambda("getAccount");
    const createAccount = createLambda("createAccount");
    const createCall = createLambda("createCall");
    const callStream = createLambda("callStream");

    orgEventTable.grantWriteData(createOrgEvent);
    callTable.grantWriteData(createCall);
    accountTable.grantReadData(getAccount);
    accountTable.grantWriteData(createAccount);

    callStream.addEventSource(
      new DynamoEventSource(callTable, {
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      }),
    );

    const api = new apigateway.RestApi(this, id + "Api", {
      deployOptions: {
        tracingEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
      },
    });

    const userPool = new cognito.UserPool(this, id + "UserPool", {
      // usernameの形式。UserPool作成後の変更はできない。
      signInType: cognito.SignInType.EMAIL,
      /**
       * これを設定しないとメアド検証メールが飛ばない。
       * なお、デフォルトはcode検証になっている。
       * リンク検証に変更する場合、コンソール上で以下の操作が必要である。
       *   - [メッセージのカスタマイズ]から[検証タイプ]を[リンク]にする
       *   - [ドメイン名]から任意のドメインを設定する
       */
      autoVerifiedAttributes: [cognito.UserPoolAttribute.EMAIL],
    });
    new cognito.UserPoolClient(this, id + "UserPoolClient", { userPool });
    const authorizer = new apigateway.CfnAuthorizer(
      this,
      id + "CognitoAuthorizer",
      {
        name: id + "CognitoAuthorizer",
        type: apigateway.AuthorizationType.COGNITO,

        identitySource: "method.request.header.Authorization",
        restApiId: api.restApiId,
        providerArns: [userPool.userPoolArn],
      },
    );

    const AuthorizationMethodOptions = {
      authorizer: { authorizerId: authorizer.ref },
      authorizationType: apigateway.AuthorizationType.COGNITO,
    };

    api.root.addMethod("get", new apigateway.LambdaIntegration(healthCheck));
    const orgEventApi = api.root.addResource("orgEvent");
    const accuntApi = api.root.addResource("account");
    const callApi = api.root.addResource("calls");
    orgEventApi.addMethod(
      "post",
      new apigateway.LambdaIntegration(createOrgEvent),
      AuthorizationMethodOptions,
    );
    accuntApi.addMethod(
      "get",
      new apigateway.LambdaIntegration(getAccount),
      AuthorizationMethodOptions,
    );
    accuntApi.addMethod(
      "post",
      new apigateway.LambdaIntegration(createAccount),
      AuthorizationMethodOptions,
    );
    callApi.addMethod("post", new apigateway.LambdaIntegration(createCall));
  }
}

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
