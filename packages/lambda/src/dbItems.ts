import { DynamoDB } from "aws-sdk";

export type GetItem = (
  params: DynamoDB.Types.GetItemInput,
) => Promise<DynamoDB.Types.GetItemOutput>;
export type PutItem = (
  params: DynamoDB.Types.PutItemInput,
) => Promise<DynamoDB.Types.PutItemOutput>;

export const getItem = (ddb: DynamoDB): GetItem => params =>
  ddb.getItem(params).promise();

export function createGetAccountParams(
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

export function createPutCallParams(
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
