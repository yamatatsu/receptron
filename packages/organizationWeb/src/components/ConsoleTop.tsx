import React, { useCallback, useState, useEffect } from "react";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { signOut, getAccount, createAccount } from "../aws";
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

  const [fetchingAccount, account] = useFetch(async () => {
    const account = await getAccount();
    if (account) return account;
    return await createAccount();
  });

  return { fetchingAccount, account, handleSignOut };
}

function useFetch<Data>(fn: () => Promise<Data>): [boolean, Data | null] {
  const [fetching, setFetching] = useState(true);
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    fn()
      .then(setData)
      .finally(() => setFetching(false));
  }, [1]);
  return [fetching, data];
}
