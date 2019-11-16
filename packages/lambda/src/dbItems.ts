import { DynamoDB } from "aws-sdk";

export function getAccountItem(
  cognitoUsername: string,
): DynamoDB.Types.GetItemInput {
  return {
    TableName: "ReceptronAccount",
    ReturnConsumedCapacity: "TOTAL",
    Key: {
      cognitoUsername: { S: cognitoUsername },
    },
  };
}

export function createCallItem(
  organizationId: string,
  timestamp: string,
): DynamoDB.Types.PutItemInput {
  return {
    TableName: "ReceptronCall",
    ReturnConsumedCapacity: "TOTAL",
    Item: {
      organizationId: { S: organizationId },
      timestamp: { S: timestamp },
    },
  };
}
