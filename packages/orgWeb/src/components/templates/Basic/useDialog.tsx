import React, { useCallback, FunctionComponent } from "react";
import { useEventCallback } from "rxjs-hooks";
import { merge, of } from "rxjs";
import { mapTo, flatMap, delay, expand, tap, take } from "rxjs/operators";

import CreateOrgDialog from "./CreateOrgDialog";
import { useToggle } from "../../hooks";
import { createOrgEvent } from "../../../aws";

type Org = { name: string };
type State = { submitting: boolean; success: boolean };

export default function useDialog() {
  const [dialogOpen, toggleDialog] = useToggle(false);
  const [addOrg, { submitting, success }] = useEventCallback<Org, State>(
    event$ => {
      return merge(
        event$.pipe(mapTo({ submitting: true, success: false })),
        event$.pipe(
          flatMap(createOrgEvent),
          mapTo({ submitting: false, success: true }),
          expand(() =>
            of({ submitting: false, success: false }).pipe(delay(2000)),
          ),
          take(2),
        ),
      );
    },
    { submitting: false, success: false },
  );

  const Dialog: FunctionComponent = useCallback(
    () => (
      <CreateOrgDialog
        addOrg={addOrg}
        open={dialogOpen}
        toggle={toggleDialog}
      />
    ),
    [addOrg, dialogOpen, toggleDialog],
  );

  return { Dialog, toggleDialog, submitting, success };
}
