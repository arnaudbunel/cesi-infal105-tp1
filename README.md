# TaskFlow — projet pédagogique INFAL105 / TP0

Projet fourni : backend Node.js/TypeScript + PostgreSQL, sans frontend requis.

## Préparer le poste
- Docker Engine + plugin Docker Compose v2 ou Docker Desktop.
- Vérifier : `docker --version` et `docker compose version`.
- Copier `.env.example` en `.env`. Le mot de passe est réservé au TP local.
- Compléter `compose.yaml` selon le document Étudiants.

## Endpoints utiles
- `GET /health` : vérification API + base de données.
- `GET /tasks` : liste des tâches.
- `POST /tasks` : crée une tâche avec JSON `{ "title": "Ma tâche" }`.
- `GET /tasks/:id` : détail d'une tâche.

## Commandes
- `docker compose config`
- `docker compose up --build -d`
- `docker compose ps`
- `docker compose logs -f api`
- `docker compose down` (conserve les volumes nommés)

## Attention
- Ne jamais publier le port 5432 de PostgreSQL sur l'hôte pour ce TP.
- Ne pas versionner `.env` ; ce n'est pas un secret manager.
- Le volume persistant n'est pas une sauvegarde.
- Ce projet de démonstration n'est pas prêt pour une exposition sur Internet.
