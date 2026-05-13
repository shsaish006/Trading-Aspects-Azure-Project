terraform {
  required_providers {
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.0"
    }
  }
}

data "azuread_domains" "default" {
  only_initial = true
}

resource "random_password" "pass" {
  count  = 6
  length = 16
}

resource "azuread_user" "users" {
  count               = 6
  user_principal_name = "user${count.index + 1}@${data.azuread_domains.default.domains[0].domain_name}"
  display_name        = "User ${count.index + 1}"
  password            = random_password.pass[count.index].result
}

resource "azuread_group" "eng_group" {
  display_name     = "EngGroup"
  security_enabled = true
}

resource "azuread_group" "biz_group" {
  display_name     = "BizGroup"
  security_enabled = true
}

resource "azuread_group" "ops_group" {
  display_name     = "OpsGroup"
  security_enabled = true
}

resource "azuread_group_member" "eng_m1" {
  group_object_id  = azuread_group.eng_group.object_id
  member_object_id = azuread_user.users[0].object_id
}

resource "azuread_group_member" "eng_m2" {
  group_object_id  = azuread_group.eng_group.object_id
  member_object_id = azuread_user.users[1].object_id
}

resource "azuread_group_member" "biz_m1" {
  group_object_id  = azuread_group.biz_group.object_id
  member_object_id = azuread_user.users[2].object_id
}

resource "azuread_group_member" "biz_m2" {
  group_object_id  = azuread_group.biz_group.object_id
  member_object_id = azuread_user.users[3].object_id
}

resource "azuread_group_member" "ops_m1" {
  group_object_id  = azuread_group.ops_group.object_id
  member_object_id = azuread_user.users[4].object_id
}

resource "azuread_group_member" "ops_m2" {
  group_object_id  = azuread_group.ops_group.object_id
  member_object_id = azuread_user.users[5].object_id
}
