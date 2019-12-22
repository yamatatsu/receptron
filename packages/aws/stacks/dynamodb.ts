import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export const defineDBs = (scope: cdk.Construct, id: string) => {
  const createDynamodbTable = DynamodbTable(scope, id);
  const orgEventTable = createDynamodbTable("OrgEvent", {
    partitionKey: {
      name: "requestId",
      type: dynamodb.AttributeType.STRING,
    },
  });
  const accountTable = createDynamodbTable("Account", {
    partitionKey: {
      name: "cognitoUsername",
      type: dynamodb.AttributeType.STRING,
    },
  });
  const organizationTable = createDynamodbTable("Organization", {
    partitionKey: {
      name: "organizationId",
      type: dynamodb.AttributeType.STRING,
    },
  });
  const callTable = createDynamodbTable("Call", {
    partitionKey: {
      name: "organizationId",
      type: dynamodb.AttributeType.STRING,
    },
    sortKey: {
      name: "timestamp",
      type: dynamodb.AttributeType.STRING,
    },
  });
  return { orgEventTable, accountTable, organizationTable, callTable };
};

const DynamodbTable = (scope: cdk.Construct, id: string) => (
  tableName: string,
  props: dynamodb.TableProps,
) => {
  return new dynamodb.Table(scope, id + tableName + "Table", {
    tableName: id + tableName,
    ...props,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    stream: dynamodb.StreamViewType.NEW_IMAGE,
  });
};
