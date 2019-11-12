import React, { useCallback } from "react";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { signOut } from "../aws";
import { usePushHistory, path } from "../Routes";

export default function ConsoleTop() {
  const toTop = usePushHistory(path.top);
  const handleSignOut = useCallback(async () => {
    await signOut();
    toTop();
  }, [history]);
  return (
    <div>
      <h1>Console</h1>
      <DefaultButton onClick={handleSignOut}>SignOut</DefaultButton>
    </div>
  );
}
