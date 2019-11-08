import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { signOut } from "../aws";

export default function ConsoleTop() {
  const history = useHistory();
  const handleSignOut = useCallback(async () => {
    await signOut();
    history.push("/");
  }, [history]);
  return (
    <div>
      <h1>Console</h1>
      <DefaultButton onClick={handleSignOut}>SignOut</DefaultButton>
    </div>
  );
}
