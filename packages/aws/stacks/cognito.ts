import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";
import * as iam from "@aws-cdk/aws-iam";

export const defineCognito = (scope: cdk.Construct, id: string) => {
  const userPool = new cognito.UserPool(scope, id + "UserPool", {
    // usernameの形式。UserPool作成後の変更はできない。
    signInType: cognito.SignInType.EMAIL,
    /**
     * これを設定しないとメアド検証メールが飛ばない。
     * なお、デフォルトはcode検証になっている。
     * リンク検証に変更する場合、コンソール上で以下の操作が必要である。
     *   - [メッセージのカスタマイズ]から[検証タイプ]を[リンク]にする
     *   - [ドメイン名]から任意のドメインを設定する
     */
    autoVerifiedAttributes: [cognito.UserPoolAttribute.EMAIL],
  });
  const userPoolClient = new cognito.UserPoolClient(
    scope,
    id + "UserPoolClient",
    { userPool, userPoolClientName: id + "UserPoolClient" },
  );
  const identityPool = new cognito.CfnIdentityPool(scope, id + "IdentityPool", {
    allowUnauthenticatedIdentities: false,
    cognitoIdentityProviders: [
      {
        clientId: userPoolClient.userPoolClientId,
        providerName: userPool.userPoolProviderName,
      },
    ],
  });
  const authenticatedRole = new iam.Role(
    scope,
    id + "CognitoDefaultAuthenticatedRole",
    {
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity",
      ),
    },
  );
  authenticatedRole.addToPolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "mobileanalytics:PutEvents",
        "cognito-sync:*",
        "cognito-identity:*",
      ],
      resources: ["*"],
    }),
  );
  new cognito.CfnIdentityPoolRoleAttachment(
    scope,
    id + "IdentityPoolRoleAttachment",
    {
      identityPoolId: identityPool.ref,
      roles: { authenticated: authenticatedRole.roleArn },
    },
  );

  return { userPool };
};
