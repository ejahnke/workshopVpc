import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';

//after initial deployment
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";



export class MyVpcmohApplicationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // This creates a new CodeCommit repository called 'WorkshopRepo'
    const repo = new codecommit.Repository(this, 'WorkshopVPCRepo', {
        repositoryName: "WorkshopVPCRepo"
    });

    const pipeline = new CodePipeline(this, 'VPCPipeline', {
      pipelineName: 'MyVPCPipeline',
      dockerEnabledForSelfMutation: true,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.codeCommit(repo,'master'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });
    
    //after initial deployment
    
    const mohVpc = new ec2.Vpc(this, "MOHVpc", {
      cidr: "10.0.0.0/16",
      maxAzs: 2,
      natGateways: 1,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      /**
       * Each entry in this list configures a Subnet Group
       *
       * ISOLATED: Isolated Subnets do not route traffic to the Internet (in this VPC).
       * PRIVATE.: Subnet that routes to the internet, but not vice versa.
       * PUBLIC..: Subnet connected to the Internet.
       */
      subnetConfiguration: [{
        cidrMask: 24,
        name: 'privateSubnets',
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      }, {
        cidrMask: 24,
        name: 'dmz',
        subnetType: ec2.SubnetType.PUBLIC,
      }],
    });
    
    const cluster = new ecs.Cluster(this, "MyVpcCluster", {
      vpc: mohVpc
    });
    
    const loadBalancedFargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyVpcFargateService", {
      cluster: cluster, // Required
      assignPublicIp: false, 
      cpu: 256, // Default is 256
      desiredCount: 2, // Default is 1
      taskImageOptions: { image: ecs.ContainerImage.fromRegistry("httpd") },
      taskSubnets: {subnetGroupName: "privateSubnets"},
      memoryLimitMiB: 1024, // Default is 512
      publicLoadBalancer: true // Default is true
    });
    
    const scalableTarget = loadBalancedFargateService.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 20,
    });
    
    scalableTarget.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
    });
    
    scalableTarget.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 50,
    });
    
    
    
    const clusterCustomImage = new ecs.Cluster(this, "MyVpcClusterCustomImage", {
      vpc: mohVpc
    });
    
    const loadBalancedFargateServiceCustomImage = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyVpcFargateServiceCustomImage", {
      cluster: clusterCustomImage, // Required
      assignPublicIp: false, 
      cpu: 256, // Default is 256
      desiredCount: 2, // Default is 1
      taskImageOptions: { image: ecs.ContainerImage.fromAsset("./MyImage"), environment: {MYDBURL:"amazon.rds.com", MYDBUSER: "ejahnke"}, },
      
      taskSubnets: {subnetGroupName: "privateSubnets"},
      memoryLimitMiB: 1024, // Default is 512
      publicLoadBalancer: true // Default is true
    });
    
    const scalableTargetCustomImage = loadBalancedFargateServiceCustomImage.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 20,
    });
    
    scalableTargetCustomImage.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
    });
    
    scalableTargetCustomImage.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 50,
    });

    
    
  }
}
