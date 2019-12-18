import React, { FunctionComponent, useCallback } from "react";
import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import { Text } from "office-ui-fabric-react/lib/Text";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Org } from "../../../domains/organization";

type Props = {
  toConsoleTop: () => void;
  handleSignOut: () => void;
  toggleDialog: () => void;
  orgs: Org[];
};
const NavBar: FunctionComponent<Props> = props => {
  const { toConsoleTop, handleSignOut, toggleDialog, orgs } = props;

  const CreateOrgButton = useCallback(
    () => (
      <Stack verticalAlign="center">
        <PrimaryButton onClick={toggleDialog} text="Create New Organization" />
      </Stack>
    ),
    [toggleDialog],
  );
  const OrgDropdown = useCallback(
    () =>
      orgs.length ? (
        <Stack verticalAlign="center" style={{ marginRight: 18 }}>
          <Dropdown
            defaultSelectedKey={orgs[0].name}
            options={orgs.map(({ name }) => ({ key: name, text: name }))}
          />
        </Stack>
      ) : null,
    [orgs],
  );

  return (
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
              key: "OrgDropdown",
              commandBarButtonAs: OrgDropdown,
            },
            {
              key: "CreateNewOrganization",
              commandBarButtonAs: CreateOrgButton,
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
          styles={{}}
        />
      </Stack.Item>
    </Stack>
  );
};
export default NavBar;
