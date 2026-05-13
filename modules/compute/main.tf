terraform {
  required_providers {
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "azurerm_public_ip" "pip1" {
  name                = "pip-vm-1"
  location            = var.location
  resource_group_name = var.resource_group_name
  allocation_method   = "Dynamic"
}

resource "azurerm_network_interface" "nic1" {
  name                = "nic-vm-1"
  location            = var.location
  resource_group_name = var.resource_group_name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.subnet1_id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.pip1.id
  }
}

resource "azurerm_network_interface" "nic2" {
  name                = "nic-vm-2"
  location            = var.location
  resource_group_name = var.resource_group_name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.subnet2_id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_network_interface" "nic3" {
  name                = "nic-vm-3"
  location            = var.location
  resource_group_name = var.resource_group_name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.subnet3_id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_linux_virtual_machine" "vm1" {
  name                = "vm-1"
  resource_group_name = var.resource_group_name
  location            = var.location
  size                = "Standard_A1_v2"
  admin_username      = "azureuser"

  network_interface_ids = [
    azurerm_network_interface.nic1.id,
  ]

  admin_ssh_key {
    username   = "azureuser"
    public_key = tls_private_key.ssh.public_key_openssh
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }
}

resource "azurerm_linux_virtual_machine" "vm2" {
  name                = "vm-2"
  resource_group_name = var.resource_group_name
  location            = var.location
  size                = "Standard_A1_v2"
  admin_username      = "azureuser"

  network_interface_ids = [
    azurerm_network_interface.nic2.id,
  ]

  admin_ssh_key {
    username   = "azureuser"
    public_key = tls_private_key.ssh.public_key_openssh
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }
}

resource "azurerm_linux_virtual_machine" "vm3" {
  name                = "vm-3"
  resource_group_name = var.resource_group_name
  location            = var.location
  size                = "Standard_A1_v2"
  admin_username      = "azureuser"

  network_interface_ids = [
    azurerm_network_interface.nic3.id,
  ]

  admin_ssh_key {
    username   = "azureuser"
    public_key = tls_private_key.ssh.public_key_openssh
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }
}

resource "azurerm_role_assignment" "vm1_user1" {
  scope                = azurerm_linux_virtual_machine.vm1.id
  role_definition_name = "Virtual Machine Contributor"
  principal_id         = var.user_ids["user1"]
}
resource "azurerm_role_assignment" "vm1_user2" {
  scope                = azurerm_linux_virtual_machine.vm1.id
  role_definition_name = "Virtual Machine Contributor"
  principal_id         = var.user_ids["user2"]
}
resource "azurerm_role_assignment" "vm2_user3" {
  scope                = azurerm_linux_virtual_machine.vm2.id
  role_definition_name = "Virtual Machine Contributor"
  principal_id         = var.user_ids["user3"]
}
resource "azurerm_role_assignment" "vm2_user4" {
  scope                = azurerm_linux_virtual_machine.vm2.id
  role_definition_name = "Virtual Machine Contributor"
  principal_id         = var.user_ids["user4"]
}
resource "azurerm_role_assignment" "vm3_user5" {
  scope                = azurerm_linux_virtual_machine.vm3.id
  role_definition_name = "Virtual Machine Contributor"
  principal_id         = var.user_ids["user5"]
}
resource "azurerm_role_assignment" "vm3_user6" {
  scope                = azurerm_linux_virtual_machine.vm3.id
  role_definition_name = "Virtual Machine Contributor"
  principal_id         = var.user_ids["user6"]
}
