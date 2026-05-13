resource "azurerm_policy_definition" "vm_sku_policy" {
  name         = "allowed-vm-skus"
  policy_type  = "Custom"
  mode         = "All"
  display_name = "Allowed VM SKUs"

  policy_rule = <<POLICY_RULE
{
  "if": {
    "allOf": [
      {
        "field": "type",
        "equals": "Microsoft.Compute/virtualMachines"
      },
      {
        "not": {
          "field": "Microsoft.Compute/virtualMachines/sku.name",
          "in": ["Standard_B1s", "Standard_A1_v2"]
        }
      }
    ]
  },
  "then": {
    "effect": "deny"
  }
}
POLICY_RULE
}

resource "azurerm_resource_group_policy_assignment" "rg_assignment" {
  name                 = "vm-sku-assignment"
  resource_group_id    = var.resource_group_id
  policy_definition_id = azurerm_policy_definition.vm_sku_policy.id
}
