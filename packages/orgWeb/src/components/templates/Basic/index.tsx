import React, { FC } from "react";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import {
  MessageBar,
  MessageBarType,
} from "office-ui-fabric-react/lib/MessageBar";
import { Subject } from "rxjs";

import { usePushHistory, path } from "../../../Routes";
import NavBar from "./NavBar";
import { useObservable } from "../../hooks";
import useHandleSignOut from "./useHandleSignOut";
import useDialog from "./useDialog";

type Org = { name: string };

const BasicTemplate: FC = props => {
  const { children } = props;
  const handleSignOut = useHandleSignOut();
  const toConsoleTop = usePushHistory(path.consoleTop);
  const orgs = useObservable(new Subject<Org[]>(), []);

  const { Dialog, toggleDialog, submitting, success } = useDialog();

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
