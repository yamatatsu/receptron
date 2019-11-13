import uuid from "uuid/v4";
import { DomainError, createDomainError, validateDomain } from "./DomainError";

export type OrganizationId = string & { _tag: "OrganizationId" };

export type InputType = "affiliation" | "destination";

export type MenuItem = {
  label: string;
  inputs: InputType[];
  order: number;
};
export type MenuItems = {
  [key: string]: MenuItem;
};

export type Destination = {
  name: string;
  imageUrl: string;
  notifyTo: string;
  order: number;
};
export type Destinations = {
  [key: string]: Destination;
};

export type Organization = {
  organizationId: OrganizationId;
  name: string;
  qrCode: string;
  menuItems: MenuItems;
  destinations: Destinations;
};

export function generateOrganizationId(): OrganizationId {
  return uuid() as OrganizationId;
}

export function generateQrCode(): string {
  return uuid();
}

export function createOrganization(
  organizationId: OrganizationId,
  name: string,
  qrCode: string,
): Organization {
  return { organizationId, name, qrCode, menuItems: {}, destinations: {} };
}

export function changeOrganization(
  organization: Organization,
  name: string,
  qrCode: string,
): Organization {
  return { ...organization, name, qrCode };
}

// TODO: should be validations of Organization, not Destination

export const validate = validateDomain(validName, validImageUrl, validNotifyTo);

const createDestinationError = createDomainError("Destination");
export function validName({ name }: Destination): null | DomainError {
  const createError = createDestinationError("name");
  if (name.length > 10) return createError("less than 10");
  return null;
}
export function validImageUrl({ imageUrl }: Destination): null | DomainError {
  const createError = createDestinationError("imageUrl");
  if (!isUrl(imageUrl)) return createError("be url style");
  return null;
}
export function validNotifyTo({ notifyTo }: Destination): null | DomainError {
  const createError = createDestinationError("notifyTo");
  if (!isUrl(notifyTo)) return createError("be url style");
  return null;
}

function isUrl(str: string) {
  // FIXME:
  return !!str;
}
