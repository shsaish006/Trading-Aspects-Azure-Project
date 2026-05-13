# Advanced Azure Infrastructure Architecture

The following diagram illustrates the network isolation, identity management, and backup strategy implemented via Terraform for the `shivamproject` resource group.

```mermaid
graph TD
  subgraph "Azure Active Directory (Microsoft Entra ID)"
    subgraph "Groups"
      EngGroup[EngGroup]
      BizGroup[BizGroup]
      OpsGroup[OpsGroup]
    end
    
    subgraph "Users"
      U1[User1] --> EngGroup
      U2[User2] --> EngGroup
      U3[User3] --> BizGroup
      U4[User4] --> BizGroup
      U5[User5] --> OpsGroup
      U6[User6] --> OpsGroup
    end
  end

  subgraph "Resource Group: shivamproject"
    
    subgraph "Network Security & Routing"
      direction LR
      VNET1[VNet-1: 10.1.0.0/16] <-->|VNet Peering| VNET2[VNet-2: 10.2.0.0/16]
      VNET2 <-->|VNet Peering| VNET3[VNet-3: 10.3.0.0/16]
      %% VNET1 and VNET3 are isolated
    end

    subgraph "Compute & Access"
      VM1[vm-1 (Ubuntu) + Public IP] 
      VM2[vm-2 (Ubuntu) - Private Only]
      VM3[vm-3 (Ubuntu) - Private Only]
      
      VNET1 --- VM1
      VNET2 --- VM2
      VNET3 --- VM3
      
      EngGroup -.->|Virtual Machine Contributor| VM1
      BizGroup -.->|Virtual Machine Contributor| VM2
      OpsGroup -.->|Virtual Machine Contributor| VM3
    end

    subgraph "Storage & Data (SAS Secured)"
      SA1[(Storage 1)]
      SA2[(Storage 2)]
      SA3[(Storage 3)]
      
      EngGroup -.->|Blob Data Contributor| SA1
      BizGroup -.->|Blob Data Contributor| SA2
      OpsGroup -.->|Blob Data Contributor| SA3
    end

    subgraph "Governance & Backup"
      Policy[Azure Policy: Restrict VM SKUs]
      Vault[Recovery Services Vault]
      BackupPol[Daily Backup Policy: 7 Days]
      
      Vault --- BackupPol
      BackupPol -.->|Protects| VM1
    end
  end

  classDef group fill:#f9f,stroke:#333,stroke-width:2px;
  classDef user fill:#bbf,stroke:#333,stroke-width:1px;
  classDef vnet fill:#bfb,stroke:#333,stroke-width:2px;
  classDef vm fill:#fbf,stroke:#333,stroke-width:2px;
  
  class EngGroup,BizGroup,OpsGroup group;
  class U1,U2,U3,U4,U5,U6 user;
  class VNET1,VNET2,VNET3 vnet;
  class VM1,VM2,VM3 vm;
```
