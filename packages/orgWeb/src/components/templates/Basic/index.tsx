import React, { useCallback, FunctionComponent } from "react";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import {
  MessageBar,
  MessageBarType,
} from "office-ui-fabric-react/lib/MessageBar";
import { signOut } from "../../../aws";
import { usePushHistory, path } from "../../../Routes";
import NavBar from "./NavBar";
import CreateOrgDialog from "./CreateOrgDialog";
import { useToggle, useObservable } from "../../hooks";
import { useEventCallback } from "rxjs-hooks";
import { Subject, merge } from "rxjs";
import { mapTo, flatMap, delay } from "rxjs/operators";

type Org = { name: string };
type State = { submitting: boolean; success: boolean };

const BasicTemplate: FunctionComponent = props => {
  const { children } = props;
  const handleSignOut = useHandleSignOut();
  const toConsoleTop = usePushHistory(path.consoleTop);
  const orgs = useObservable(new Subject<Org[]>(), []);

  const { Dialog, toggleDialog, submitting, success } = useBasicTemplate();

  return (
    <Stack>
      <NavBar
        toConsoleTop={toConsoleTop}
        handleSignOut={handleSignOut}
        toggleDialog={toggleDialog}
        orgs={orgs}
      />
      {submitting && <MessageBar>Creating a Organization...</MessageBar>}
      {success && (
        <MessageBar messageBarType={MessageBarType.success}>
          Success Creating a Organization!
        </MessageBar>
      )}
      <Dialog />
      {children}
    </Stack>
  );
};
export default BasicTemplate;

// private

function useHandleSignOut() {
  const toTop = usePushHistory(path.top);
  const handleSignOut = useCallback(() => signOut().then(toTop), [true]);
  return handleSignOut;
}

function useBasicTemplate() {
  const [dialogOpen, toggleDialog] = useToggle(false);
  const [addOrg, { submitting, success }] = useEventCallback<Org, State>(
    event$ => {
      const api$ = event$.pipe(
        flatMap(org => {
          console.log(`flowed org => ${JSON.stringify(org)}`);
          return new Promise<State>(res =>
            setTimeout(() => res({ submitting: false, success: true }), 2000),
          );
        }),
      );
      return merge(
        event$.pipe(mapTo({ submitting: true, success: false })),
        api$,
        api$.pipe(delay(2000), mapTo({ submitting: false, success: false })),
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
