import Auth, { CognitoUser } from "@aws-amplify/auth";
import { Credential } from "../types";

Auth.configure({
  Auth: {
    region: "ap-northeast-1",
    userPoolId: "ap-northeast-1_NX2h2wZ5X",
    userPoolWebClientId: "7ebtn9qhiara40f1ufrmd9nphq",
  },
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
