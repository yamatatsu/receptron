import { ScRxJpServerStaging } from './stacks'
import cdk = require('@aws-cdk/core')

const app = new cdk.App()

new ScRxJpServerStaging(app, 'ScRxJpServerStaging', {
  env: {
    region: 'ap-northeast-1',
    // TODO: とりあえず、開発共有のアカウント
    // sc machine-user IAM作る
    account: '271851996434',
  },
})
