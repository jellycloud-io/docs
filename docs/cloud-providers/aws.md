---
id: aws
title: AWS
sidebar_position: 8
---

# AWS

## Connect your account {#credentials}

Connect your AWS account to JellyCloud using an IAM role that JellyCloud assumes. JellyCloud never stores long-lived access keys for your account. It requests short-lived credentials through STS each time it needs to act.

### 1. Choose an External ID

Pick a unique, hard-to-guess string to use as the **External ID** (for example, the output of `uuidgen`). The External ID protects the role from being assumed on behalf of another JellyCloud customer. You will use it in the trust policy and enter it in JellyCloud.

### 2. Create the IAM role

Create a role with the following trust policy. Replace `<external-id>` with the value from step 1.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::306298468661:root" },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": { "sts:ExternalId": "<external-id>" }
      }
    }
  ]
}
```

With the AWS CLI:

```bash
aws iam create-role \
  --role-name JellyCloudAccess \
  --assume-role-policy-document file://trust-policy.json
```

### 3. Attach permissions

Attach a policy that lets JellyCloud manage instances, volumes, and networking. The following inline policy contains the minimum permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Instances",
      "Effect": "Allow",
      "Action": [
        "ec2:RunInstances",
        "ec2:StartInstances",
        "ec2:StopInstances",
        "ec2:TerminateInstances",
        "ec2:DescribeInstances",
        "ec2:CreateTags"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Volumes",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateVolume",
        "ec2:AttachVolume",
        "ec2:DetachVolume",
        "ec2:DeleteVolume",
        "ec2:DescribeVolumes"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Networking",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateVpc",
        "ec2:DescribeVpcs",
        "ec2:ModifyVpcAttribute",
        "ec2:CreateSubnet",
        "ec2:DescribeSubnets",
        "ec2:CreateInternetGateway",
        "ec2:AttachInternetGateway",
        "ec2:DescribeInternetGateways",
        "ec2:CreateRoute",
        "ec2:DescribeRouteTables",
        "ec2:CreateSecurityGroup",
        "ec2:DescribeSecurityGroups",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:RevokeSecurityGroupIngress"
      ],
      "Resource": "*"
    }
  ]
}
```

```bash
aws iam put-role-policy \
  --role-name JellyCloudAccess \
  --policy-name JellyCloudEC2 \
  --policy-document file://permissions-policy.json
```

:::note Spot instances
If you plan to use Spot capacity and have never launched a Spot instance in this account, AWS needs the `AWSServiceRoleForEC2Spot` service-linked role. Create it once with `aws iam create-service-linked-role --aws-service-name spot.amazonaws.com`.
:::

Copy the role's ARN (e.g. `arn:aws:iam::123456789012:role/JellyCloudAccess`):

```bash
aws iam get-role --role-name JellyCloudAccess --query Role.Arn --output text
```

### 4. Add to JellyCloud

In the Console, navigate to the **Providers** page, select **AWS**, and click **Connect**. Enter the **Role ARN** and the **External ID**, then click **Apply**. JellyCloud will validate access by assuming the role before storing the details in a secured secret manager.
