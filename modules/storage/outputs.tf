output "sas_token" {
  value     = data.azurerm_storage_account_blob_container_sas.sas.sas
  sensitive = true
}
