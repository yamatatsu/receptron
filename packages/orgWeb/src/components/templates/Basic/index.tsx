import React, { useCallback, FunctionComponent } from "react";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import { signOut } from "../../../aws";
import { usePushHistory, path } from "../../../Routes";
import NavBar from "./NavBar";
import CreateOrgDialog from "./CreateOrgDialog";
import { orgAdded$, orgState$ } from "../../../domains/org";
import { useToggle, useObservable, useSubject } from "../../hooks";

const BasicTemplate: FunctionComponent = props => {
  const { children } = props;
  const handleSignOut = useHandleSignOut();
  const toConsoleTop = usePushHistory(path.consoleTop);
  const orgs = useObservable(orgState$, []);

  const { Dialog, toggleDialog } = useBasicTemplate();

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

function useHandleSignOut() {
  const toTop = usePushHistory(path.top);
  const handleSignOut = useCallback(() => signOut().then(toTop), [true]);
  return handleSignOut;
}

function useBasicTemplate() {
  const [dialogOpen, toggleDialog] = useToggle(false);
  const addOrg = useSubject(orgAdded$);

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

  return { Dialog, toggleDialog };
}
