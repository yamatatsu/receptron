import React from "react";
import {
  PrimaryButton,
  DefaultButton,
} from "office-ui-fabric-react/lib/Button";
import { usePushHistory, path } from "../Routes";

export default function Top() {
  const toConsole = usePushHistory(path.consoleTop);
  const toSignUp = usePushHistory(path.signUp);
  return (
    <div>
      <h1>Topページ</h1>
      <DefaultButton onClick={toConsole}>Console</DefaultButton>
      <PrimaryButton onClick={toSignUp}>SignUp</PrimaryButton>
    </div>
  );
}
