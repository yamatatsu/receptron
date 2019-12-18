import { Subject } from "rxjs";
import { scan } from "rxjs/operators";

// Model
export type Org = { name: string };

// Events
export const orgAdded$ = new Subject<Org>();

// State
const initial: Org[] = [];
export const orgState$ = orgAdded$.pipe(
  scan((orgs, org) => [...orgs, org], initial),
);
