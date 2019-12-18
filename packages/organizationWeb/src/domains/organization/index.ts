import { Subject } from "rxjs";
import { scan, tap } from "rxjs/operators";

export type Org = { name: string };

// Events
export const orgAdded$ = new Subject<Org>();

// State
const initial: Org[] = [];
export const orgState$ = orgAdded$.pipe(
  tap(org => console.log("11" + JSON.stringify(org))),
  scan((orgs, org) => {
    console.log("44" + JSON.stringify(orgs));
    return [...orgs, org];
  }, initial),
  tap(orgs => console.log("22" + JSON.stringify(orgs))),
);
