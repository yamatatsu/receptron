import React from "react";
import { useHistory } from "react-router-dom";
import {
  PrimaryButton,
  DefaultButton,
} from "office-ui-fabric-react/lib/Button";

export default function Top() {
  const history = useHistory();
  const toConsole = () => history.push("/console");
  const toSignUp = () => history.push("/signUp");
  return (
    <div>
      <h1>Topページ</h1>
      <DefaultButton onClick={toConsole}>Console</DefaultButton>
      <PrimaryButton onClick={toSignUp}>SignUp</PrimaryButton>
    </div>
  );
}
