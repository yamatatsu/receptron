import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export const defineDBs = (scope: cdk.Construct, id: string) => {
  const accountTable = new dynamodb.Table(scope, id + "AccountTable", {
    tableName: id + "Account",
    partitionKey: {
      name: "cognitoUsername",
      type: dynamodb.AttributeType.STRING,
    },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    stream: dynamodb.StreamViewType.NEW_IMAGE,
  });

  const organizationTable = new dynamodb.Table(
    scope,
    id + "OrganizationTable",
    {
      tableName: id + "Organization",
      partitionKey: {
        name: "organizationId",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_IMAGE,
    },
  );

  const callTable = new dynamodb.Table(scope, id + "CallTable", {
    tableName: id + "Call",
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
  return { accountTable, organizationTable, callTable };
};
