resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

module "identity" {
  source            = "./modules/identity"
  resource_group_id = azurerm_resource_group.rg.id
}

module "network" {
  source              = "./modules/network"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
}

module "compute" {
  source              = "./modules/compute"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  subnet1_id          = module.network.subnet1_id
  subnet2_id          = module.network.subnet2_id
  subnet3_id          = module.network.subnet3_id
  user_ids            = module.identity.user_ids
}

module "storage" {
  source              = "./modules/storage"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  eng_group_id        = module.identity.group_ids["EngGroup"]
  biz_group_id        = module.identity.group_ids["BizGroup"]
  ops_group_id        = module.identity.group_ids["OpsGroup"]
}

module "policy" {
  source            = "./modules/policy"
  resource_group_id = azurerm_resource_group.rg.id
}

module "backup" {
  source              = "./modules/backup"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  vm1_id              = module.compute.vm1_id
}
