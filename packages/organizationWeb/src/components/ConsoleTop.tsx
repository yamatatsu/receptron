import React, { useCallback, useState, useEffect } from "react";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { signOut, getAccount } from "../aws";
import { usePushHistory, path } from "../Routes";

export default function ConsoleTop() {
  const { account, handleSignOut } = useConsoleTop();

  return (
    <div>
      <h1>Console</h1>
      <DefaultButton onClick={handleSignOut}>SignOut</DefaultButton>
      <p>{JSON.stringify(account, null, 2)}</p>
    </div>
  );
}

function useConsoleTop() {
  const toTop = usePushHistory(path.top);

  const handleSignOut = useCallback(async () => {
    await signOut();
    toTop();
  }, [history]);

  const [account, setAccount] = useState(null);
  useEffect(() => {
    getAccount().then(setAccount);
  }, [1]);

  return { account, handleSignOut };
}
