import { DynamoDB } from "aws-sdk";
const marshall = DynamoDB.Converter.marshall;

export type GetItem = (
  params: DynamoDB.Types.GetItemInput,
) => Promise<DynamoDB.Types.GetItemOutput>;
export type PutItem = (
  params: DynamoDB.Types.PutItemInput,
) => Promise<DynamoDB.Types.PutItemOutput>;

const GetItemInput = (tableaName: string) => (
  model: object,
): DynamoDB.Types.GetItemInput => ({
  TableName: "Receptron" + tableaName,
  ReturnConsumedCapacity: "TOTAL",
  Key: marshall(model),
});

const PutItemInput = (tableaName: string) => (
  model: object,
): DynamoDB.Types.PutItemInput => ({
  TableName: "Receptron" + tableaName,
  ReturnConsumedCapacity: "TOTAL",
  Item: marshall(model),
});

export function createGetAccountParams(
  cognitoUsername: string,
): DynamoDB.Types.GetItemInput {
  return GetItemInput("Account")({ cognitoUsername });
}

export function createPutAccountParams(
  cognitoUsername: string,
): DynamoDB.Types.PutItemInput {
  return PutItemInput("Account")({ cognitoUsername, organizationIds: [] });
}

export function createPutCallParams(
  organizationId: string,
  timestamp: string,
): DynamoDB.Types.PutItemInput {
  return PutItemInput("Call")({ organizationId, timestamp });
}

export function toPutOrgEventParams(orgEvent: {
  requestId: string;
  username: string;
  evantType: string;
  payload: object;
}): DynamoDB.Types.PutItemInput {
  return PutItemInput("OrgEvent")(orgEvent);
}
