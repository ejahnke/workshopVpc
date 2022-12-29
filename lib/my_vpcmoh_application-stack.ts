/*

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

DO NOT deploy this code for any kind of production purposes

*/

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
    /*
    const mohVpc = new ec2.Vpc(this, "MOHVpc", {
      cidr: "10.0.0.0/16",
      maxAzs: 2,
      natGateways: 1,
      enableDnsHostnames: true,
      enableDnsSupport: true,
     
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
  
  
    const clusterMyPayara = new ecs.Cluster(this, "MyVpcClusterMyPayara", {
      vpc: mohVpc
    });
  
    const loadBalancedFargateServiceMyPayara = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyVpcFargateServiceMyPayara", {
      cluster: clusterMyPayara, // Required
      assignPublicIp: false, 
      cpu: 256, // Default is 256
      desiredCount: 2, // Default is 1
      taskImageOptions: { image: ecs.ContainerImage.fromAsset("./MyPayaraImage"), containerPort: 8080 },
      
      taskSubnets: {subnetGroupName: "privateSubnets"},
      memoryLimitMiB: 1024, // Default is 512
      publicLoadBalancer: true // Default is true
    });
    
    loadBalancedFargateServiceMyPayara.targetGroup.configureHealthCheck({
      port: "8080"
    });
    
    const scalableTargetCustomMyPayara = loadBalancedFargateServiceMyPayara.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 20,
    });
    
    scalableTargetCustomMyPayara.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
    });
    
    scalableTargetCustomMyPayara.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 50,
    });
    */
    
  }
}
