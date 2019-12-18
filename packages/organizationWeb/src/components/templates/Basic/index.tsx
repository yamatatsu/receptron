import React, { useCallback, FunctionComponent } from "react";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import { signOut } from "../../../aws";
import { usePushHistory, path } from "../../../Routes";
import NavBar from "./NavBar";
import CreateOrgDialog from "./CreateOrgDialog";
import { orgAdded$, orgState$ } from "../../../domains/organization";
import { useToggle, useObservable, useSubject } from "../../hooks";

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

  const orgs = useObservable(orgState$, []);
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
