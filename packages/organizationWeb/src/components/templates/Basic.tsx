import React, { useCallback, FunctionComponent } from "react";
import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import { Text } from "office-ui-fabric-react/lib/Text";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { signOut } from "../../aws";
import { usePushHistory, path } from "../../Routes";

type Org = { key: string; text: string };

const BasicTemplate: FunctionComponent = props => {
  const { children } = props;

  const orgs = [
    { key: "apple", text: "Apple" },
    { key: "banana", text: "Banana" },
  ];

  const { SelectOrg, toConsoleTop, handleSignOut } = useBasicTemplate(orgs);

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
      {children}
    </Stack>
  );
};
export default BasicTemplate;

// private

function useBasicTemplate(orgs: Org[]) {
  const toTop = usePushHistory(path.top);
  const toConsoleTop = usePushHistory(path.consoleTop);

  const SelectOrg: FunctionComponent = useCallback(
    () => (
      <Stack verticalAlign="center">
        <Dropdown defaultSelectedKey={orgs[0].key} options={orgs} />
      </Stack>
    ),
    [orgs],
  );

  const handleSignOut = useCallback(() => {
    signOut().then(toTop);
  }, [history]);

  return { SelectOrg, toConsoleTop, handleSignOut };
}
