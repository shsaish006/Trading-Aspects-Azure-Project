output "group_ids" {
  value = {
    "EngGroup" = azuread_group.eng_group.object_id
    "BizGroup" = azuread_group.biz_group.object_id
    "OpsGroup" = azuread_group.ops_group.object_id
  }
}

output "user_ids" {
  value = {
    for i in range(6) : "user${i + 1}" => azuread_user.users[i].object_id
  }
}
