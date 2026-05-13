output "vm1_id" {
  value = azurerm_linux_virtual_machine.vm1.id
}

output "vm1_public_ip" {
  value = azurerm_linux_virtual_machine.vm1.public_ip_address
}
