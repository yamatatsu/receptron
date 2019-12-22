import { useCallback } from "react";
import { signOut } from "../../../aws";
import { usePushHistory, path } from "../../../Routes";

export default function useHandleSignOut() {
  const toTop = usePushHistory(path.top);
  const handleSignOut = useCallback(() => signOut().then(toTop), [true]);
  return handleSignOut;
}
