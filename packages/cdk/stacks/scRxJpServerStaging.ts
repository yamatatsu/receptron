import { Duration } from '@aws-cdk/core'
import cdk = require('@aws-cdk/core')
import ec2 = require('@aws-cdk/aws-ec2')
import lambda = require('@aws-cdk/aws-lambda')
import apigateway = require('@aws-cdk/aws-apigateway')
// import cognito = require('@aws-cdk/aws-cognito')
import route53 = require('@aws-cdk/aws-route53')
import targets = require('@aws-cdk/aws-route53-targets')
import certmgr = require('@aws-cdk/aws-certificatemanager')

export class ScRxJpServerStaging extends cdk.Stack {
  constructor(parent: cdk.App, id: string, props?: cdk.StackProps) {
    super(parent, id, props)

    // FIXME: CDK版の表現力がまだ弱いのでCFn版を使う(v0.33.0)
    // const userPool = new cognito.UserPool(this, 'ScRxJpUserPool', {
    //   poolName: 'sc-rx-jp',
    //   signInType: cognito.SignInType.Email,
    //   autoVerifiedAttributes: [],
    // })
    // FIXME: Cognito CFn おそらくバグってる
    // https://github.com/terraform-providers/terraform-provider-aws/issues/7261
    // 置き換えではない修正を加えた場合に全ユーザーを消して作り直されたりするし
    // UserPoolは手作りですすめる
    // const userPoolCfn = new cognito.CfnUserPool(this, 'ScRxJpUserPoolCfn', {
    //   userPoolName: 'sc-rx-jp',
    //   usernameAttributes: ['email'],
    //   autoVerifiedAttributes: ['email'],
    //   mfaConfiguration: 'ON',
    //   emailConfiguration: {
    //     emailSendingAccount: 'DEVELOPER',
    //     sourceArn:
    //       'arn:aws:ses:us-west-2:271851996434:identity/development.cureapp.net',
    //   },
    //   smsConfiguration: {},
    //   policies: {
    //     passwordPolicy: {
    //       minimumLength: 8,
    //       requireLowercase: false,
    //       requireNumbers: true,
    //       requireSymbols: false,
    //       requireUppercase: false,
    //     },
    //   },
    // })
    // new cognito.UserPoolClient(this, 'ScRxJpUserPoolClient', {
    //   clientName: 'userApp',
    //   userPool: {
    //     node: userPoolCfn.node,
    //     userPoolId: userPoolCfn.userPoolId,
    //     userPoolArn: userPoolCfn.userPoolArn,
    //     userPoolProviderName: userPoolCfn.userPoolProviderName,
    //     userPoolProviderUrl: userPoolCfn.userPoolProviderUrl,
    //   },
    // })

    const TIMEOUT_DURATION = Duration.seconds(10) // seconds
    const lambdaV1 = new lambda.Function(this, 'ScRxJpServerLambdaV1', {
      functionName: 'sc-rx-jp-server-v1',
      // NOTE: execされたpath(今回の場合、index.ts)からなので、実体パスと違う
      // npm経由でserver-entryのコードをinstallして、resolveした方がキレイかも？
      code: new lambda.AssetCode('../server-entry/dist'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        DEBUG: 'mbaas:*',
        PATH_PREFIX: '/v1',
        NODE_ENV: 'staging',
        MONGODB_URL:
          'mongodb+srv://sc-rx-jp-server:jdQ0anO76nmdTjFq@shared-staging-yxsix.mongodb.net/test',
        MONGODB_DBNAME: 'sc-rx-jp',
      },
      vpc: ec2.Vpc.fromLookup(this, 'VPC', {
        vpcId: 'vpc-0b6f4679da3ec912b',
      }),
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(
        this,
        'MongodbAtrasSG',
        'sg-062864d759842b2ae',
      ),
      timeout: TIMEOUT_DURATION,
    })

    const lambdaIntegrationV1 = new apigateway.LambdaIntegration(lambdaV1)

    const apiV1 = new apigateway.RestApi(this, 'ScRxJpServerApiV1', {
      restApiName: 'sc-rx-jp-server-v1',
      defaultIntegration: lambdaIntegrationV1,
    })

    const cognitoAuthrizer = new apigateway.CfnAuthorizer(
      this,
      'Cognito-Userpool',
      {
        name: 'Cognito-Userpool',
        type: 'COGNITO_USER_POOLS',
        restApiId: apiV1.restApiId,
        identitySource: 'method.request.header.x-mpftoken',
        providerArns: [
          'arn:aws:cognito-idp:ap-northeast-1:271851996434:userpool/ap-northeast-1_68HBQIas2',
        ],
      },
    )

    apiV1.root.addProxy({
      defaultIntegration: lambdaIntegrationV1,
      defaultMethodOptions: {
        authorizationType: apigateway.AuthorizationType.COGNITO,
        authorizer: {
          authorizerId: cognitoAuthrizer.ref,
        },
      },
    })

    const zone = route53.HostedZone.fromLookup(this, 'ScRxJpServerHostedZone', {
      domainName: 'development.cureapp.net',
    })

    const domainName = 'server.sc.development.cureapp.net'

    const certificate = new certmgr.DnsValidatedCertificate(
      this,
      'ScRxJpServerCertificate',
      { domainName, hostedZone: zone },
    )

    const apiDomainName = new apigateway.DomainName(
      this,
      'ScRxJpServerApiDomain',
      {
        domainName,
        certificate,
      },
    )

    apiDomainName.addBasePathMapping(apiV1, { basePath: 'v1' })

    new route53.ARecord(this, 'ScRxJpServerRoute53', {
      zone,
      recordName: 'server.sc.development.cureapp.net',
      target: route53.RecordTarget.fromAlias(
        new targets.ApiGatewayDomain(apiDomainName),
      ),
    })
  }
}
