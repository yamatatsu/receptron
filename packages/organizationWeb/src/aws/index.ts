import Auth, { CognitoUser } from "@aws-amplify/auth";
import API from "@aws-amplify/api";
import { Credential } from "../types";

Auth.configure({
  region: "ap-northeast-1",
  userPoolId: "ap-northeast-1_NX2h2wZ5X",
  userPoolWebClientId: "7ebtn9qhiara40f1ufrmd9nphq",
});
API.configure({
  endpoints: [
    {
      name: "MyAPIGatewayAPI",
      endpoint:
        "https://h7kak0nkod.execute-api.ap-northeast-1.amazonaws.com/prod",
      custom_header: () =>
        Auth.currentSession()
          .then(session => session.getIdToken().getJwtToken())
          .then(token => ({ Authorization: token })),
    },
  ],
});

export const SIGN_IN_ERROR_CODE = {
  USER_NOT_CONFIRMED: "UserNotConfirmedException",
  PASSWORD_RESET_REQUIRED: "PasswordResetRequiredException",
  NOT_AUTHORIZED: "NotAuthorizedException",
  USER_NOT_FOUND: "UserNotFoundException",
} as const;

export const currentAuthenticatedUser = (): Promise<CognitoUser> =>
  Auth.currentAuthenticatedUser();
export const signIn = (credential: Credential) => Auth.signIn(credential);
export const signUp = (credential: Credential) => Auth.signUp(credential);
export const signOut = () => Auth.signOut();

export const getAccount = () => API.get("MyAPIGatewayAPI", "/account", {});
export const createAccount = () => API.post("MyAPIGatewayAPI", "/account", {});
