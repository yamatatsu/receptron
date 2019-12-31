import Auth, { CognitoUser } from "@aws-amplify/auth";
import API from "@aws-amplify/api";
import { Credential } from "../types";

const urlBase = process.env.URL_BASE;
const userPoolId = process.env.USER_POOL_ID;
const userPoolWebClientId = process.env.USER_POOL_WEB_CLIENT_ID;
const identityPoolId = process.env.IDENTITY_POOL_ID;

Auth.configure({
  region: "ap-northeast-1",
  userPoolId,
  userPoolWebClientId,
  identityPoolId,
});
API.configure({
  endpoints: [
    {
      name: "MyAPIGatewayAPI",
      endpoint: urlBase,
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

type Org = { name: string };
export const createOrgEvent = (org: Org): Promise<void> =>
  API.post("MyAPIGatewayAPI", "/orgEvent", {
    body: { eventType: "org_created", org },
  });
