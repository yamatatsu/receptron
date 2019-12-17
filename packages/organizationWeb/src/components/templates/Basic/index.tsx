import React, { useState, useCallback, FunctionComponent } from "react";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import { useEventCallback } from "rxjs-hooks";
import { map, withLatestFrom } from "rxjs/operators";
import { signOut } from "../../../aws";
import { usePushHistory, path } from "../../../Routes";
import NavBar from "./NavBar";
import CreateOrgDialog from "./CreateOrgDialog";
import { Org } from "./type";

const BasicTemplate: FunctionComponent = props => {
  const { children } = props;

  const {
    Dialog,
    orgs,
    toConsoleTop,
    handleSignOut,
    toggleDialog,
  } = useBasicTemplate();

  return (
    <Stack>
      <NavBar
        toConsoleTop={toConsoleTop}
        handleSignOut={handleSignOut}
        toggleDialog={toggleDialog}
        orgs={orgs}
      />
      <Dialog />
      {children}
    </Stack>
  );
};
export default BasicTemplate;

// private

function useBasicTemplate() {
  const toTop = usePushHistory(path.top);
  const toConsoleTop = usePushHistory(path.consoleTop);

  const [dialogOpen, toggleDialog] = useToggle(false);

  const initial: Org[] = [];
  const [addOrg, orgs] = useEventCallback<Org, Org[]>(
    (event$, state$) =>
      event$.pipe(
        withLatestFrom(state$),
        map(([org, a]) => [...a, org]),
      ),
    initial,
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

  const handleSignOut = useCallback(() => {
    signOut().then(toTop);
  }, [history]);

  return {
    Dialog,
    orgs,
    toConsoleTop,
    handleSignOut,
    toggleDialog,
  };
}

function useToggle(defaultValue: boolean): [boolean, () => void] {
  const [val, set] = useState(defaultValue);
  return [val, () => set(!val)];
}
