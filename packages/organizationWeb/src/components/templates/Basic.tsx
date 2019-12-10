import React, { useState, useCallback, FunctionComponent } from "react";
import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import { Text } from "office-ui-fabric-react/lib/Text";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import {
  PrimaryButton,
  DefaultButton,
} from "office-ui-fabric-react/lib/Button";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import {
  Dialog,
  DialogType,
  DialogFooter,
} from "office-ui-fabric-react/lib/Dialog";
import { useEventCallback } from "rxjs-hooks";
import { map, withLatestFrom } from "rxjs/operators";
import { signOut } from "../../aws";
import { usePushHistory, path } from "../../Routes";
import { useFormik } from "formik";

const BasicTemplate: FunctionComponent = props => {
  const { children } = props;

  const {
    CreateOrg,
    SelectOrg,
    toConsoleTop,
    handleSignOut,
  } = useBasicTemplate();

  return (
    <Stack>
      <Stack
        horizontal
        verticalAlign="center"
        tokens={{
          childrenGap: 20,
          padding: 10,
        }}
      >
        <Stack.Item>
          <Text variant="xxLarge">
            <a onClick={toConsoleTop}>Receptron</a>
          </Text>
        </Stack.Item>
        <Stack.Item grow>
          <CommandBar
            items={[
              {
                key: "organization",
                text: "Organization",
                // cacheKey: "myCacheKey", // changing this key will invalidate this item's cache
                iconProps: { iconName: "Org" },
                commandBarButtonAs: SelectOrg,
              },
            ]}
            farItems={[
              {
                key: "user",
                text: "User",
                ariaLabel: "User",
                iconOnly: true,
                iconProps: { iconName: "Contact" },
                onClick: handleSignOut,
              },
            ]}
            overflowButtonProps={{ ariaLabel: "More commands" }}
            ariaLabel="Use left and right arrow keys to navigate between commands"
          />
        </Stack.Item>
      </Stack>
      <CreateOrg />
      {children}
    </Stack>
  );
};
export default BasicTemplate;

// private

type Org = { name: string };

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

  const SelectOrg: FunctionComponent = useCallback(
    () => <Control orgs={orgs} toggleDialog={toggleDialog} />,
    [orgs, dialogOpen],
  );

  const CreateOrg: FunctionComponent = useCallback(
    () => <Form addOrg={addOrg} open={dialogOpen} toggle={toggleDialog} />,
    [addOrg, dialogOpen, toggleDialog],
  );

  const handleSignOut = useCallback(() => {
    signOut().then(toTop);
  }, [history]);

  return {
    CreateOrg,
    SelectOrg,
    toConsoleTop,
    handleSignOut,
  };
}

const Control: FunctionComponent<{
  orgs: Org[];
  toggleDialog: () => void;
}> = ({ orgs, toggleDialog }) => (
  <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 20 }}>
    {orgs.length ? (
      <>
        <Dropdown
          defaultSelectedKey={orgs[0].name}
          options={orgs.map(({ name }) => ({ key: name, text: name }))}
        />
        <PrimaryButton onClick={toggleDialog} text="Create New Organization" />
      </>
    ) : (
      <PrimaryButton onClick={toggleDialog} text="Create New Organization" />
    )}
  </Stack>
);

const Form: FunctionComponent<{
  addOrg: (e: Org) => void;
  open: boolean;
  toggle: () => void;
}> = ({ addOrg, open, toggle }) => {
  const { submitForm, handleChange, values } = useFormik({
    onSubmit: args => {
      addOrg(args);
      toggle();
    },
    initialValues: { name: "" },
  });

  return (
    <Dialog
      hidden={!open}
      onDismiss={toggle}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: "Create New Organization",
        subText:
          "At first, you need to create new organization for starting Receptron!",
      }}
    >
      <form onSubmit={submitForm}>
        <TextField
          label="Name"
          type="text"
          name="name"
          onChange={handleChange}
          value={values.name}
        />
      </form>
      <DialogFooter>
        <PrimaryButton onClick={submitForm} text="Create" />
        <DefaultButton onClick={toggle} text="Cancel" />
      </DialogFooter>
    </Dialog>
  );
};

function useToggle(defaultValue: boolean): [boolean, () => void] {
  const [val, set] = useState(defaultValue);
  return [val, () => set(!val)];
}
