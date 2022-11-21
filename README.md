# Welcome to your sample CDK TypeScript project for CodeFest!

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Deployment steps

1. Provision your AWS account via https://dashboard.eventengine.run/dashboard by entering the event hash provided by AWS
2. Select Email OTP option and enter your email used for registration
3. Follow login steps and open the AWS console
4. Launch an AWS Cloud9 m5.large environment in ca-central-1 with default settings
5. Open the IDE environment and clone the provided git repo
```
git clone https://github.com/ejahnke/workshopVpc.git
```
6. update/workshopVpc/bin/my_vpcmoh_application.ts with your current AWS account number and region
7. navigate into the recently cloned folder workshopVpc and install required libraries
```
npm install aws-cdk-lib
```
8. bootstrap the AWS account for CDK deployments
```
cdk bootstrap
```
9. deploy the CDK stack which will create an AWS CodeCommit repository and an AWS CodePipeline for our subsequent deployments
```
cdk deploy
```
10. Once deployment is complete, navigate to the IAM service in the AWS console and find a role with the following embedded string in its name *VPCPipelineBuildSynthCdk*
11. Edit such role and add the following permission to the existing customer inline policy: Service =  ec2, Action = DescribeAvailabilityZones
12. Review the newly created assets under CodeCommit and CodePipeline. Gather the HTTPS (GRC) URL from the CodeCommit repository (e.g. codecommit::ca-central-1://WorkshopVPCRepo)
13. Go back into the AWS Cloud9 environment and uncomment the code under *//after initial deployment* in /workshopVpc/lib/my_vpcmoh_application-stack.ts. This new code will deploy AWS Fargate clusters based on a custom docker image file along with an Application Load Balancer. It will deploy these assets on a new VPC which has its own NAT Gateway, Internet Gateway and required subnets.
14. Reset the git configuration inside workshopVpc
- `rm -rf .git`
- `git init`
- `git add --all`
- `git commit -m "initial commit"`
- `git remote add myrepo <HTTPS_GRC_URL_FROM_CODECOMMIT>`
- `git push -u myrepo master`
15. The above commit will trigger the AWS CodePipeline and deploy the assets. (approx. 10 minutes)
16. Once deployed, navigate into the EC2 service in the AWS console and open Load Balancers. You will see two new Application Load Balancers with public DNS entries for testing. One hosts a customized Apache HTTP server and the other a standard Payara server instance.
