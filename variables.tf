variable "location" {
  description = "The Azure Region to deploy resources in"
  type        = string
  default     = "Central India"
}

variable "resource_group_name" {
  description = "The name of the Resource Group"
  type        = string
  default     = "shivamproject"
}
