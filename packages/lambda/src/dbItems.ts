import { DynamoDB } from "aws-sdk";

const marshall = DynamoDB.Converter.marshall;

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
    Key: marshall({ cognitoUsername }),
  };
}

export function createPutAccountParams(
  cognitoUsername: string,
): DynamoDB.Types.PutItemInput {
  return {
    TableName: "ReceptronAccount",
    ReturnConsumedCapacity: "TOTAL",
    Item: marshall({ cognitoUsername, organizationIds: [] }),
  };
}

export function createPutCallParams(
  organizationId: string,
  timestamp: string,
): DynamoDB.Types.PutItemInput {
  return {
    TableName: "ReceptronCall",
    ReturnConsumedCapacity: "TOTAL",
    Item: marshall({ organizationId, timestamp }),
  };
}
