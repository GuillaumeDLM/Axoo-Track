variable "app_port" {
  description = "Port interne de l'API Axoo-Track"
  type        = number
  default     = 3000
}

variable "db_user" {
  description = "Nom d'utilisateur PostgreSQL"
  type        = string
  default     = "axoo"
}

variable "db_password" {
  description = "Mot de passe PostgreSQL"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Nom de la base de données"
  type        = string
  default     = "axootrack"
}

variable "jwt_secret" {
  description = "Clé secrète pour la signature des tokens JWT"
  type        = string
  sensitive   = true
}

variable "dynatrace_tenant_url" {
  description = "URL du tenant Dynatrace"
  type        = string
  default     = "https://wkf10640.live.dynatrace.com"
}

variable "dynatrace_token" {
  description = "Token API pour Dynatrace OneAgent"
  type        = string
  sensitive   = true
}
