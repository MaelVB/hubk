# Kubernetes Manifests

Two deployment modes are provided with Kustomize:

- Dynamic only (no Postgres): `kubectl apply -k k8s/overlays/dynamic`
- Hybrid (Postgres + dynamic + configured apps): `kubectl apply -k k8s/overlays/hybrid`

Before applying:

1) Update image names in `k8s/base/api-deployment.yaml` and `k8s/base/web-deployment.yaml`.
2) Set your Authentik URLs and scopes in `k8s/base/api-configmap.yaml` and `k8s/base/web-configmap.yaml`.
3) Replace secrets in `k8s/base/secret.yaml` and `k8s/overlays/hybrid/postgres-secret.yaml`.
4) Update the ingress hosts in `k8s/base/ingress.yaml`.

Notes:

- `APPS_MODE=dynamic` disables Postgres entirely.
- `APPS_MODE=hybrid` enables Postgres and combines Authentik + configured apps.
- Postgres uses a `ReadWriteOnce` PVC named `hubk-postgres-pvc`.
