export type DomainError = {
  domain: string;
  property: string;
  message: string;
};

export const createDomainError = (domain: string) => (property: string) => (
  message: string,
) => ({
  domain,
  property,
  message,
});

export const validateDomain = <D>(
  ...validaters: ((domain: D) => null | DomainError)[]
) => (destination: D): true | DomainError[] => {
  const results = validaters
    .map(fn => fn(destination))
    .filter(<T>(res: T): res is NonNullable<T> => !!res);
  return results.length ? results : true;
};
