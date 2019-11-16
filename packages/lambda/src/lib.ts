export function getParam(body: string | null, paramName: string): string {
  if (!body) throw new Error(`No body is set.`);

  const param: string | undefined = JSON.parse(body).organizationId;
  if (!param) throw new Error(`No ${paramName} is set. ${body}`);

  return param;
}

export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(`Expected 'val' to be defined, but received ${val}`);
  }
}

export function log(obj: Object) {
  Object.entries(obj).forEach(([k, v]) => {
    console.log(`${k}:: ${JSON.stringify(v, null, 2)}`);
  });
}
