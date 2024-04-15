# Anime List API

1. To run this project you have to download this repository:
```bash
git clone https://github.com/Edouard-Pon/anime-list-api
```

2. When you downloaded project, you have to install necessary dependencies:
```bash
npm install package.json
```

3. In project, you need to create "__.env__" file where you need to add a mongoose database url and secret key:
```dotenv
DATABASE_URL=<url>
SECRET_KEY=<key>
API_KEY=<key>
```

4. To run the project use:
```bash
npm run start
```
or
```bash
npm run devStart
```

## Description

* API WIP

## Endpoints

| Method | Endpoint          | Description     | Auth  |
| --- |-------------------|-----------------|:-----:|
| GET | /anime            | Get all animes  |       |
| GET | /anime/:id        | Get anime by id |       |
| POST | /anime/create     | Add anime       | Admin |
| PUT | /anime/:id        | Update anime    | Admin |
| DELETE | /anime/:id        | Delete anime    | Admin |
| POST | /anime/search     | Search anime    |       |
| | | |       |
| GET | /character        | Get all characters |       |
| GET | /character/:id    | Get character by id |       |
| POST | /character/create | Add character | Admin |
| PUT | /character/:id    | Update character | Admin |
| DELETE | /character/:id    | Delete character | Admin |
| POST | /character/search | Search character |       |
| | | |       |
| GET | /anime-list/:userId | Get anime list by user id | User  |
| POST | /anime-list/:userId/favorites    | Add anime to favorites | User  |
| DELETE | /anime-list/:userId/favorites/:animeId | Remove anime from favorites | User  |
| POST | /anime-list/:userId/watched    | Add anime to watched | User  |
| DELETE | /anime-list/:userId/watched/:animeId | Remove anime from watched | User  |
| POST | /anime-list/:userId/abandoned    | Add anime to abandoned | User  |
| DELETE | /anime-list/:userId/abandoned/:animeId | Remove anime from abandoned | User  |
| | | |       |
| POST | /user/login       | Login user      |       |
| POST | /user/register    | Register user   |       |
