export type EventType =
  | { type: "create"; name: string }
  | { type: "change_name"; name: string };

export type Event = {
  organizationId: string;
  timestamp: Date;
} & EventType;
