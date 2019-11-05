export function getParam(body: string | null, paramName: string): string {
  if (!body) throw new Error(`No body is set.`);

  const param: string | undefined = JSON.parse(body).organizationId;
  if (!param) throw new Error(`No ${paramName} is set. ${body}`);

  return param;
}
