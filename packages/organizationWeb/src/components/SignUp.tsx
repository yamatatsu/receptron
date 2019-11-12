import React, { useCallback } from "react";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import {
  MessageBar,
  MessageBarType,
} from "office-ui-fabric-react/lib/MessageBar";
import { useFormik } from "formik";
import { signUp } from "../aws";
import { Credential } from "../types";
import { usePushHistory, path } from "../Routes";

export default function SignUp() {
  const [asyncError, setAsyncError] = React.useState("");
  const toSignIn = usePushHistory(path.signIn);
  const { values, handleChange, handleSubmit } = useFormik<Credential>({
    initialValues: { username: "", password: "" },
    onSubmit: useCallback(
      credential => {
        signUp(credential)
          .then(toSignIn)
          .catch(err => setAsyncError(err.message));
      },
      [history],
    ),
  });

  return (
    <form onSubmit={handleSubmit}>
      <h1>SignUpページ</h1>
      {asyncError && (
        <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
          {asyncError}
        </MessageBar>
      )}
      <TextField
        label="Username(Email)"
        type="text"
        name="username"
        onChange={handleChange}
        value={values.username}
      />
      <TextField
        label="Password"
        type="password"
        name="password"
        onChange={handleChange}
        value={values.password}
      />
      <PrimaryButton type="submit">SignUp</PrimaryButton>
    </form>
  );
}
