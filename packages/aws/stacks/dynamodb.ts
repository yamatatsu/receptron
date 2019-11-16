import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export const defineDBs = (scope: cdk.Construct, id: string) => {
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
  return { organizationTable, callTable };
};
