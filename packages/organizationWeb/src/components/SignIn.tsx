import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import {
  MessageBar,
  MessageBarType,
} from "office-ui-fabric-react/lib/MessageBar";
import { useFormik } from "formik";
import { signIn, SIGN_IN_ERROR_CODE } from "../aws";
import { Credential } from "../types";

export default function SignIn() {
  const [asyncError, setAsyncError] = React.useState("");
  const history = useHistory();
  const onSubmit = useCallback(
    credential => {
      signIn(credential)
        .then(() => history.push("/console"))
        .catch(err => {
          if (!Object.values(SIGN_IN_ERROR_CODE).includes(err.code)) {
            return Promise.reject(err);
          }
          setAsyncError(err.message);
          return Promise.resolve();
        });
    },
    [history],
  );
  const { values, handleChange, handleSubmit } = useFormik<Credential>({
    initialValues: { username: "", password: "" },
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit}>
      <h1>SignInページ</h1>
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
      <PrimaryButton type="submit">SignIn</PrimaryButton>
    </form>
  );
}
