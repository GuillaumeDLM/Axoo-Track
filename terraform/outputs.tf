output "cluster_status" {
  description = "Commande pour vérifier le statut du cluster"
  value       = "minikube status"
}

output "namespace" {
  description = "Namespace Kubernetes du projet"
  value       = kubernetes_namespace.axoo_track.metadata[0].name
}

output "api_service" {
  description = "Nom du service API dans le cluster"
  value       = kubernetes_service.axoo_track_api.metadata[0].name
}

output "access_url" {
  description = "Commande pour obtenir l'URL d'accès via Minikube"
  value       = "minikube service axoo-track-proxy -n ${var.namespace} --url"
}

output "dashboard" {
  description = "Commande pour ouvrir le dashboard Kubernetes"
  value       = "minikube dashboard"
}
