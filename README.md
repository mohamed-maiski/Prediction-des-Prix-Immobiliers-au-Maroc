# Prédiction des prix immobiliers au Maroc

Projet d'analyse de données immobilières et de prédiction de prix avec Python, scikit-learn et Flask. Les notebooks explorent les annonces, préparent les données et comparent plusieurs modèles de régression. L'interface web permet de saisir les caractéristiques d'un bien et d'obtenir une estimation en dirhams marocains (MAD / DH).

> **Périmètre actuel : Casablanca.** Malgré le titre du projet, le jeu de données final ne contient que cette ville. Le projet est un prototype ; ses résultats ne sont pas encore validés pour une utilisation réelle ni pour d'autres villes.

## Fonctionnalités

- Exploration des prix, surfaces, quartiers et types de biens dans les notebooks.
- Comparaison de modèles, dont la régression linéaire, Random Forest et XGBoost.
- Application Flask utilisant un modèle Random Forest sauvegardé.
- Pages d'accueil, d'analyse, de présentation, de prédiction et de contact.
- Enregistrement des messages de contact dans MySQL, sous réserve de configurer la base.

## Données

| Fichier | Contenu | Nombre de lignes |
| --- | --- | ---: |
| `data/mubawab_listings_casablanca.csv` | Annonces brutes associées à Mubawab | 3 300 |
| `data/data_clean.csv` | Données nettoyées | 1 771 |
| `data/final_data.csv` | Données utilisées par l'application | 1 766 |

La cible est `Price`. Les dix variables attendues par l'application sont, dans cet ordre :

```text
Type, Localisation, City, Area, Rooms, Bedrooms, Bathrooms, Floor, Current_state, Age
```

La date de collecte, la méthode de collecte et les droits de redistribution des annonces restent à documenter. Les prix d'annonces ne constituent pas une validation des prix de transaction. Vérifier les doublons, les valeurs atypiques et l'homogénéité des annonces avant de réentraîner le modèle.

## Structure du dépôt

```text
Prediction-des-Prix-Immobiliers-au-Maroc/
├── app.py                              # Routes Flask et prédiction
├── requirements.txt                    # Dépendances actuelles, à compléter
├── data/                               # Données brutes et préparées
├── models/
│   ├── random_forest_model.pkl
│   └── label_encoders_and_scaler.pkl
├── notebook/
│   ├── notebook.ipynb                   # Préparation et modélisation
│   └── analyse.ipynb                    # Analyses et visualisations
├── static/                             # CSS, JavaScript et images
└── templates/                          # Pages HTML de l'application
```

## Installation locale

### 1. Cloner le dépôt

```bash
git clone https://github.com/mohamed-maiski/Prediction-des-Prix-Immobiliers-au-Maroc.git
cd Prediction-des-Prix-Immobiliers-au-Maroc
```

### 2. Créer un environnement virtuel

Python 3.11 constitue un point de départ pour reproduire l'environnement visible dans les sorties des notebooks. Une installation complète dans un environnement vierge reste à valider.

```bash
python -m venv .venv
```

Sous Windows PowerShell :

```powershell
.\.venv\Scripts\Activate.ps1
```

Sous Linux / macOS :

```bash
source .venv/bin/activate
```

### 3. Installer les dépendances

```bash
python -m pip install -r requirements.txt
python -m pip install scikit-learn==1.4.1.post1
```

**Le fichier `requirements.txt` est incomplet.** scikit-learn est nécessaire pour charger les modèles, mais n'y figure pas. Les deux fichiers `.pkl` contiennent la version `1.4.1.post1` dans leurs métadonnées ; cette version sert donc de référence pour leur chargement. Les dépendances MySQL actuelles doivent également être revues et l'installation vérifiée dans un environnement neuf.

Les notebooks nécessitent des bibliothèques supplémentaires selon les cellules exécutées : Jupyter, matplotlib, seaborn, scipy, plotly, xgboost, imbalanced-learn, geopy et folium. Leur environnement et leurs versions restent à formaliser séparément de ceux de l'application.

### 4. Lancer l'application

Depuis la racine du dépôt :

```bash
python app.py
```

Ouvrir [http://127.0.0.1:5000](http://127.0.0.1:5000). Le code actuel écoute sur `0.0.0.0:5000`, donc sur les interfaces réseau disponibles.

Les fichiers de `models/` et `data/final_data.csv` sont chargés au démarrage. MySQL est utilisé lors de l'envoi d'un message de contact : le code attend une base `stage` et une table `contact` avec les colonnes `nom`, `prenom`, `email`, `object` et `message`. Aucun script de création de cette base n'est fourni.

La connexion utilise actuellement `localhost`, l'utilisateur `root` et un mot de passe vide. Remplacer cette configuration par des variables d'environnement et un compte dédié avant tout déploiement.

Ne charger des fichiers pickle que lorsqu'ils proviennent d'une source de confiance.

## Évaluation et limites connues

**Le score de 90 % affiché dans l'interface n'est pas une mesure calculée par l'application.** Le serveur fixe `score = 0.90` et le template affiche `R² Score : 90%`. Un R² n'est pas une probabilité de justesse pour un bien individuel.

À titre de trace d'expérimentation, les sorties enregistrées de `notebook/notebook.ipynb` affichent notamment des R² de test d'environ **0,758** et **0,829** pour deux expériences Random Forest, avec des configurations différentes. Ces valeurs n'ont pas été recalculées lors de cette revue et ne certifient pas les performances du fichier `.pkl` distribué.

Le notebook ajuste les encodeurs et le scaler avant la séparation entraînement/test, ce qui introduit une fuite d'information. Il réutilise aussi plusieurs variables de modèles et réentraîne `rf` sur l'ensemble des données avant une cellule d'export de cette variable. Il faut rendre la chaîne d'entraînement et d'export explicite pour relier chaque modèle à son évaluation.

Autres limites de l'application :

- Les encodeurs sont réajustés à chaque requête sur le bien saisi et dix lignes tirées au hasard. Les codes des catégories peuvent ainsi différer de ceux de l'entraînement, et les encodeurs partagés sont modifiés entre requêtes.
- Les entrées numériques et les catégories ne sont pas suffisamment validées côté serveur.
- Le champ `City` est désactivé dans le formulaire et peut être absent des données envoyées ; la casse de la ville doit aussi correspondre aux données d'entraînement (`Casablanca`).
- Les messages d'erreur internes sont renvoyés directement au navigateur.
- Si la connexion MySQL échoue, le bloc de fermeture peut utiliser une variable `connection` non initialisée et masquer l'erreur d'origine.

## Corrections prioritaires

| Priorité | Modification | Objectif |
| --- | --- | --- |
| 1 | Conserver le prétraitement appris, supprimer le réajustement des encodeurs et l'échantillon aléatoire pendant la prédiction ; définir le traitement des catégories inconnues | Assurer des prédictions cohérentes avec l'entraînement |
| 1 | Séparer les données avant tout ajustement, utiliser un pipeline, fixer les graines aléatoires et exporter ensemble prétraitement, modèle et métriques | Reproduire et vérifier les résultats |
| 1 | Retirer le score fixe et publier R², MAE et RMSE sur un jeu de test indépendant, avec le protocole d'évaluation | Présenter des performances vérifiables |
| 1 | Compléter les dépendances et tester l'installation dans un environnement vierge | Permettre à d'autres personnes d'exécuter le projet |
| 2 | Valider les champs côté serveur, transmettre correctement `City`, normaliser les catégories et retourner des erreurs HTTP adaptées | Fiabiliser le formulaire et l'API |
| 2 | Externaliser la configuration MySQL, fournir le schéma SQL et sécuriser la fermeture des connexions | Rendre le contact configurable et fonctionnel |
| 2 | Ajouter des tests de prédiction répétée, d'entrées invalides et d'échec MySQL | Vérifier les comportements essentiels |
| 3 | Nettoyer les cellules exploratoires et erreurs enregistrées des notebooks ; fournir une procédure d'entraînement reproductible | Faciliter la lecture et la maintenance |
| 3 | Ajouter une capture de l'application et documenter la provenance des données et des images | Améliorer la présentation publique |

## Préparer la publication sur GitHub

- Examiner les fichiers **et l'historique Git** pour retirer tout secret ou contenu personnel avant publication ; remplacer tout secret déjà exposé.
- Ajouter un `.gitignore` pour `.venv/`, `__pycache__/`, `.ipynb_checkpoints/`, `.env` et les fichiers locaux.
- Vérifier les droits de publication des données et des images ; retirer ou remplacer les éléments dont la redistribution n'est pas autorisée.
- Choisir une licence adaptée au code et ajouter un fichier `LICENSE`. Aucune licence n'est actuellement fournie dans le dépôt ; préciser séparément les droits sur les données et médias.
- Retirer le fichier vide `git` à la racine s'il n'a pas d'utilité.
- Corriger les points prioritaires ci-dessus et vérifier le parcours de prédiction avant de présenter l'application comme fonctionnelle.

Pour rendre le dépôt public avec un accès administrateur : ouvrir le dépôt sur GitHub, puis **Settings → General → Danger Zone → Change repository visibility → Change visibility**, choisir **Public** et suivre les confirmations. Voir la [documentation officielle GitHub](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility).

La visibilité publique permet de consulter le code. Pour proposer une démonstration web accessible aux visiteurs, un déploiement de l'application Flask doit être préparé séparément.
