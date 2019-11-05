import { DynamoDB } from "aws-sdk";

export function createCallItem(
  organizationId: string,
  timestamp: string,
): DynamoDB.Types.PutItemInput {
  return {
    TableName: "Call",
    ReturnConsumedCapacity: "TOTAL",
    Item: {
      organizationId: { S: organizationId },
      timestamp: { S: timestamp },
    },
  };
}
