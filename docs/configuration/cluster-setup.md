---
id: cluster-setup
title: Cluster Setup
sidebar_position: 1
---

# Cluster Setup

Connecting a cluster installs the JellyCloud Operator, which bridges your Kubernetes control plane with JellyCloud-managed infrastructure. The [Quick Start](/quick-start#3-connect-a-cluster) covers the default, seamless setup. This page covers the rest: how the Operator is installed, how broadly it can access your namespaces, the cluster-wide defaults it applies, and integration with private registries and managed Kubernetes services.

**On this page:**
- [Connect your cluster](#connect-your-cluster)
- [Deployment methods](#deployment-methods)
- [Access modes](#access-modes): [Seamless](#seamless-mode-default) · [Selective](#selective-rbac)
- [Cluster-wide defaults (ClusterConfig)](#cluster-wide-defaults-clusterconfig)
- [Private registry](#private-registry)
- [Kubernetes environments](#kubernetes-environments): [GKE](#gke-google-kubernetes-engine) · [AKS](#aks-azure-kubernetes-service) · [EKS](#eks-amazon-elastic-kubernetes-service)
- [Disconnecting a cluster](#disconnecting-a-cluster)

## Connect your cluster

**Requirements:** Your cluster needs at least one node with **2 vCPUs** and **4 GB memory** available to run the JellyCloud Operator. No network or firewall configuration is required.

:::tip Multiple clusters
You can connect any number of Kubernetes clusters to JellyCloud. All of them share the same pool of connected instances. Workloads across clusters remain fully isolated from one another.
:::

1. In the Console, click **Add** in the top-right corner and select **Add Cluster**. JellyCloud will generate a Helm command with an auto-generated secret unique to your tenant.

   :::warning Keep your Helm command private
   The generated Helm command contains secrets unique to your tenant. Do not share it publicly, commit it to version control, or expose it in logs.
   :::

2. Copy the Helm command from the Console and run it on your cluster. The command installs the JellyCloud Operator into the `jelly` namespace and authenticates it using the embedded token. No extra configuration is needed.

3. The Operator takes a couple of minutes to initialize. Watch the rollout:

   ```bash
   kubectl -n jelly get pods --watch
   ```

   Wait until all pods show `Running`, then verify the cluster nodes:

   ```bash
   kubectl get nodes
   ```

   You will see virtual nodes added by JellyCloud alongside your existing ones. Each node represents a group of instances sharing the same architecture. Run `kubectl describe node <node-name>` to inspect a node. Allocatable capacity reflects the actual resources of the instances you connected.

4. Your cluster is now ready. Run any standard Kubernetes `Deployment` or `StatefulSet` and JellyCloud will schedule it across your connected nodes and cloud providers. No changes to your manifests are required.

## Deployment methods

JellyCloud supports two ways to install the Operator into your cluster.

### Automated (Supervisor)

The default path. The Helm command generated in the Console installs the JellyCloud Supervisor, which manages the lifecycle of all Operator components automatically, including upgrades.

This is the recommended approach for most teams.

### Manual (Helm / ArgoCD / CI pipelines)

If your organization manages cluster tooling through GitOps, ArgoCD, or internal CI pipelines, you can deploy JellyCloud components manually using the individual Helm chart links exposed in the Console under **Settings**. This lets you version-control the deployment, apply your own values overrides, and integrate JellyCloud into your existing release process.

Both methods support all access modes described below.

## Access modes

When connecting a cluster, you choose the RBAC scope the Operator is granted. This controls which namespaces JellyCloud can observe and schedule workloads into.

### Seamless mode (default)

In seamless mode, JellyCloud is granted cluster-wide visibility and scheduling permissions. This is the default configuration and requires no extra setup beyond the standard Helm install.

JellyCloud can observe and schedule workloads across all namespaces. This is the recommended starting point for most clusters and the simplest path to getting workloads running on JellyCloud infrastructure.

### Selective mode (namespace-scoped RBAC) {#selective-rbac}

Selective mode restricts JellyCloud to a declared set of namespaces. The operator only observes and schedules workloads in namespaces you explicitly authorize. Workloads in other namespaces are invisible to JellyCloud and will never be placed on JellyCloud nodes.

This mode is intended for multi-tenant clusters and environments with strict namespace isolation requirements.

#### Step 1: Install the Supervisor with namespaced mode enabled

Run the standard Supervisor install command from the Console, adding `--set security.namespaced=true`:

```bash
helm upgrade --install jellycloud oci://registry-1.docker.io/jellycloud/supervisor \
  --set apiKey=<your-api-key> \
  --version <version> \
  --set security.namespaced=true
```

This replaces the cluster-wide `ClusterRoleBinding` with namespace-scoped `RoleBindings` limited to the `jelly` namespace. At this point, JellyCloud has no access to any of your workload namespaces yet.

#### Step 2: Grant access to specific namespaces

Install the `namespaced-rbac` chart, passing the list of namespaces JellyCloud should manage:

```bash
helm upgrade --install jelly-namespaced-rbac oci://registry-1.docker.io/jellycloud/namespaced-rbac \
  --version <version> \
  --set namespaces="{team-a,team-b}" \
  -n jelly
```

This creates the necessary `RoleBindings` in each listed namespace, granting JellyCloud service accounts the permissions they need to observe and schedule workloads there.

:::note Namespaces must exist before running this command
Each namespace listed must already exist in your cluster. Create any missing namespaces with `kubectl create namespace <name>` before running the command.
:::

:::warning Always list all namespaces
Each time you run this command, whether adding or removing namespaces, you must include the **complete** list. Any namespace omitted from the list will have its `RoleBindings` removed and will no longer be accessible to JellyCloud.
:::

:::warning Move workloads before removing a namespace
If you remove a namespace while some of its pods are running on JellyCloud nodes, those pods get stuck, because JellyCloud can no longer manage them. The Console alerts you when a change removes access to a namespace that has pods running on JellyCloud. Move those workloads off JellyCloud nodes before you remove the namespace.
:::

The change takes effect automatically. You do not need to restart JellyCloud components.

#### Behavior for unlisted namespaces

Workloads in namespaces that are not whitelisted are silently skipped. They do not appear in the JellyCloud Console, are not considered for scheduling on JellyCloud nodes, and are not affected in any way by the operator.

## Cluster-wide defaults (ClusterConfig)

The JellyCloud Operator creates a cluster-scoped `ClusterConfig` resource named `cluster-config` when it is installed. It holds the defaults JellyCloud applies to every workload in the cluster, unless a [Workload Policy](/configuration/workload-policies) overrides them for a namespace or workload. It also holds cloud credentials settings, such as the GCP service account used for [Artifact Registry access](#gke-google-kubernetes-engine).

The defaults are:

```yaml
apiVersion: controller.jellycloud.io/v1alpha1
kind: ClusterConfig
metadata:
  name: cluster-config
spec:
  scheduling:
    mode: allowed
    priority: first
    autoscaler: allowed
    volumeSharedStorage: preferred
  network:
    privateHostDetection: true
```

All fields are described in the [settings reference](/configuration/workload-policies#settings-reference).

### Change the defaults

Confirm the Operator is deployed and all pods in the `jelly` namespace are in `Running` state, then update the `ClusterConfig` with `kubectl patch`, or edit it directly with `kubectl edit clusterconfig.controller.jellycloud.io cluster-config`.

The most common change is the cluster-wide [mode of operation](/configuration/workload-policies#mode-of-operation). For example, to stop JellyCloud from scheduling any workload unless a namespace or workload opts in:

```bash
kubectl patch clusterconfig.controller.jellycloud.io cluster-config --type merge \
  --patch '{"spec": {"scheduling": {"mode": "forbidden"}}}'
```

Set `mode` back to `allowed` to return to the default.

## Private registry

JellyCloud supports pulling images from private container registries using standard Kubernetes mechanisms. Both pod-level and service account-level `imagePullSecrets` are supported. When pull secrets are attached to a Kubernetes `ServiceAccount`, the Operator reads and forwards them automatically, so you do not need to repeat them on every pod spec.

For cloud-managed registries, see the [Kubernetes environments](#kubernetes-environments) section below. GKE clusters can use GCP Workload Identity to pull from Google Artifact Registry, AKS clusters can use Azure Managed Identity, and EKS clusters can pull from Amazon ECR using a refreshed pull secret.

## Kubernetes environments

JellyCloud works out of the box with any standard Kubernetes distribution, and most clusters need no additional configuration. GKE, AKS, and EKS have optional setup steps for pulling images from their cloud-managed registries.

### GKE (Google Kubernetes Engine)

When your workloads pull images from Google Artifact Registry (GAR), you can use GCP Workload Identity to grant JellyCloud nodes pull access without storing credentials in the cluster.

JellyCloud nodes authenticate using the `jelly-node` Kubernetes service account in the `jelly` namespace. The steps below bind a GCP service account with Artifact Registry read access to that service account.

:::tip Already have a service account with pull access?
If you already have a GCP service account with `roles/artifactregistry.reader`, skip to steps 3 and 4.
:::

1. Create a GCP service account (or use an existing one):

   ```bash
   gcloud iam service-accounts create <gcp-service-account-name> \
     --project=<project-name>
   ```

2. Grant the service account permission to pull from Artifact Registry:

   ```bash
   gcloud projects add-iam-policy-binding <project-name> \
     --member="serviceAccount:<gcp-service-account-email>" \
     --role="roles/artifactregistry.reader"
   ```

3. Bind the GCP service account to the JellyCloud node Kubernetes service account using Workload Identity:

   ```bash
   gcloud iam service-accounts add-iam-policy-binding \
     <gcp-service-account-email> \
     --project=<project-name> \
     --role=roles/iam.workloadIdentityUser \
     --member="serviceAccount:<project-name>.svc.id.goog[jelly/jelly-node]"
   ```

4. Update the cluster config to register the GCP service account with JellyCloud:

   ```bash
   kubectl patch clusterconfig.controller.jellycloud.io cluster-config --type merge \
     --patch '{"spec": {"credentials": {"gcp": {"serviceAccount": "<gcp-service-account-email>"}}}}'
   ```

After step 4, JellyCloud nodes will use the bound GCP service account to authenticate image pulls from Artifact Registry.

### AKS (Azure Kubernetes Service)

When your AKS cluster uses multiple managed identities, JellyCloud needs to know which identity to use for each workload. This is configured via a label applied at the pod or namespace level.

:::note
This configuration is only required if your cluster is configured with multiple managed identities. Single-identity clusters work without any additional setup.
:::

**Step 1: Find the Client ID of the relevant Managed Identity**

Locate the Client ID of the managed identity associated with your AKS node pool or workload identity configuration.

:::warning Do not use `az identity list` output directly
Running `az identity list -g <resource-group> -o table` returns managed identity resource IDs, not the AKS workload identity Client ID. Use the Client ID shown in the Azure Portal or your AKS identity configuration.
:::

**Step 2: Apply the Client ID label**

Add the `azure.jellycloud.io/client-id` label to the workload or namespace:

On a Deployment (applies to that workload only):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: data-test
  namespace: data
spec:
  replicas: 1
  selector:
    matchLabels:
      app: loadjob
  template:
    metadata:
      labels:
        app: loadjob
        azure.jellycloud.io/client-id: <client-id>
```

On a Namespace (applies to all Deployments in that namespace):

```bash
kubectl label namespace <namespace> azure.jellycloud.io/client-id=<client-id>
```

JellyCloud will use the specified managed identity when scheduling workloads onto AKS nodes.

### EKS (Amazon Elastic Kubernetes Service)

EKS clusters are supported, including clusters whose nodes are provisioned by [Karpenter](https://karpenter.sh/).

#### Pulling images from Amazon ECR

JellyCloud nodes run outside your EKS node groups, so they cannot use the EC2 instance profile that EKS nodes normally rely on to pull from ECR. Use an `imagePullSecret` instead. ECR pull tokens expire after 12 hours, so the secret must be refreshed on a schedule. The steps below run a `CronJob` that refreshes the token every 6 hours and attaches it to the workload's service account. JellyCloud forwards service account pull secrets automatically.

The examples use the `apps` namespace. Replace it with your workload namespace.

1. Create an IAM user with the `AmazonEC2ContainerRegistryReadOnly` policy and store its access key in the cluster:

   ```bash
   kubectl create secret generic aws-ecr-creds \
     --from-literal=AWS_ACCESS_KEY_ID=<access-key-id> \
     --from-literal=AWS_SECRET_ACCESS_KEY=<secret-access-key> \
     --from-literal=AWS_REGION=<region> \
     -n apps
   ```

2. Create a service account that is allowed to update the pull secret:

   ```yaml
   apiVersion: v1
   kind: ServiceAccount
   metadata:
     name: registry-refresher
     namespace: apps
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: Role
   metadata:
     name: secret-writer
     namespace: apps
   rules:
     - apiGroups: [""]
       resources: ["secrets"]
       verbs: ["get", "create", "update", "patch"]
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: RoleBinding
   metadata:
     name: registry-refresher-binding
     namespace: apps
   subjects:
     - kind: ServiceAccount
       name: registry-refresher
       namespace: apps
   roleRef:
     kind: Role
     name: secret-writer
     apiGroup: rbac.authorization.k8s.io
   ```

3. Create the refresh `CronJob`:

   ```yaml
   apiVersion: batch/v1
   kind: CronJob
   metadata:
     name: ecr-token-refresh
     namespace: apps
   spec:
     schedule: "0 */6 * * *"
     successfulJobsHistoryLimit: 1
     failedJobsHistoryLimit: 2
     jobTemplate:
       spec:
         template:
           spec:
             serviceAccountName: registry-refresher
             restartPolicy: OnFailure
             volumes:
               - name: token
                 emptyDir: {}
             initContainers:
               # Fetch a fresh ECR token and registry address
               - name: get-token
                 image: amazon/aws-cli:2.17.0
                 envFrom:
                   - secretRef:
                       name: aws-ecr-creds
                 volumeMounts:
                   - name: token
                     mountPath: /token
                 command:
                   - /bin/sh
                   - -c
                   - |
                     set -e
                     ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
                     echo "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com" > /token/registry
                     aws ecr get-login-password --region "${AWS_REGION}" > /token/password
             containers:
               # Write the token into the ecr-pull secret
               - name: update-secret
                 image: alpine/k8s:1.35.9
                 volumeMounts:
                   - name: token
                     mountPath: /token
                 command:
                   - /bin/sh
                   - -c
                   - |
                     set -e
                     kubectl create secret docker-registry ecr-pull \
                       --docker-server="$(cat /token/registry)" \
                       --docker-username=AWS \
                       --docker-password="$(cat /token/password)" \
                       --namespace=apps \
                       --dry-run=client -o yaml | kubectl apply -f -
   ```

   To create the first token immediately instead of waiting for the schedule, run `kubectl create job --from=cronjob/ecr-token-refresh ecr-token-init -n apps`.

4. Attach the pull secret to the service account your workloads use:

   ```bash
   kubectl patch serviceaccount default -n apps \
     -p '{"imagePullSecrets":[{"name":"ecr-pull"}]}'
   ```

:::tip Avoid storing an access key
On EKS, you can give the `registry-refresher` service account an IAM role through [IAM Roles for Service Accounts (IRSA)](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) instead of storing an access key. Annotate the service account with `eks.amazonaws.com/role-arn`, attach `AmazonEC2ContainerRegistryReadOnly` to the role, and remove the `aws-ecr-creds` secret and the `envFrom` block from the `get-token` init container (set `AWS_REGION` as a plain environment variable).
:::

## Disconnecting a cluster

To disconnect a cluster run the below helm command

```bash
helm uninstall jellycloud 
```

Upon cluster disconnect, all meta-data is purged, running workloads are stopped. Persistent volumes are retained. See [Volume lifecycle on cluster disconnect](/configuration/volumes#volume-lifecycle-on-cluster-disconnect).

