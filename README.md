# Algorithmic Trading Network Infrastructure

## Project Overview

This project provisions an enterprise-grade, highly secure algorithmic trading network on Microsoft Azure using Infrastructure as Code (Terraform) and includes a custom frontend dashboard (React) for visualizing the network topology.

The infrastructure utilizes a 3-tier isolated Virtual Network architecture with strict non-transitive peering rules to ensure maximum security boundaries between engineering, business, and operations environments.

## Architecture Highlights

1. Identity and Access Management
- Utilizes Azure Active Directory (Entra ID) for centralized access control.
- Defines 3 specific security groups: Engineering, Business, and Operations.
- Implements strict Role-Based Access Control (RBAC) assigning "Virtual Machine Contributor" and "Storage Blob Data Contributor" roles only to authorized group members.

2. Network Topology
- Provisions 3 distinct Virtual Networks (VNets), each containing a dedicated subnet.
- Network isolation is enforced via Non-Transitive Peering: VNet-1 is peered to VNet-2, and VNet-2 is peered to VNet-3. Traffic cannot route from VNet-1 to VNet-3.
- Network Security Groups (NSGs) are attached to each subnet to strictly manage inbound and outbound rules.

3. Compute Resources
- Deploys 3 Ubuntu 22.04 LTS Virtual Machines (Standard_A1_v2).
- Enforces SSH key-based authentication.
- Implements Azure Policies at the resource group level to restrict deployment to authorized VM sizes only.

4. Storage and Backup
- Provisions isolated Azure Storage Accounts with Locally Redundant Storage (LRS) for each department.
- Configures an Azure Recovery Services Vault with automated daily backup policies ensuring disaster recovery capabilities for critical nodes.

## Repository Structure

- /modules/: Contains all custom Terraform modules.
  - /identity/: Azure AD users, groups, and RBAC assignments.
  - /network/: VNets, Subnets, NSGs, and Peering configurations.
  - /compute/: Virtual Machines, NICs, and Public IPs.
  - /storage/: Storage accounts and blob containers.
  - /policy/: Custom Azure policies enforcing deployment rules.
  - /backup/: Recovery Services Vault and backup policies.
- /trading-dashboard/: React/Vite web application serving as the interactive UI for the infrastructure.
- main.tf: Root module orchestrating all sub-modules.
- variables.tf: Global input variables (e.g., location, resource group name).
- outputs.tf: Global outputs (e.g., public IP addresses).

## Deployment Instructions

### Infrastructure
1. Authenticate with Azure CLI: `az login`
2. Initialize Terraform: `terraform init`
3. Preview the infrastructure: `terraform plan`
4. Deploy the infrastructure: `terraform apply`

### Frontend Dashboard
1. Navigate to the dashboard directory: `cd trading-dashboard`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Security Considerations

Do not commit `.tfstate` files, `.terraform` directories, or `.pem` SSH keys to version control. Ensure all sensitive variables are handled securely.
