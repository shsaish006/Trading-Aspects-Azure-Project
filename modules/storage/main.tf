resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

resource "azurerm_storage_account" "sa1" {
  name                     = "engstorage${random_string.suffix.result}"
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_account" "sa2" {
  name                     = "bizstorage${random_string.suffix.result}"
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_account" "sa3" {
  name                     = "opsstorage${random_string.suffix.result}"
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_role_assignment" "eng_storage" {
  scope                = azurerm_storage_account.sa1.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = var.eng_group_id
}

resource "azurerm_role_assignment" "biz_storage" {
  scope                = azurerm_storage_account.sa2.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = var.biz_group_id
}

resource "azurerm_role_assignment" "ops_storage" {
  scope                = azurerm_storage_account.sa3.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = var.ops_group_id
}
