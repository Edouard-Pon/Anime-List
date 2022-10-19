# Anime List Website

1. To run this project you have to download this repository:
```bash
git clone https://github.com/Edouard-Pon/Anime-List
```

2. When you downloaded project, you have to install necessary dependencies:
```bash
npm install package.json
```

3. In project, you need to create "__.env__" file where you need to add a mongoose database url:
```dotenv
DATABASE_URL=<url>
```

4. To run the website use:
```bash
npm run start
```
or
```bash
npm run devStart
```

### Description

* This project was created for studying purposes and for local storage of my anime, manga and ranobe lists.
* At this moment this website can:
  * Show in profile anime list by  "Watching", "Watched", "To Watch" or "Abandoned"
  * Every added anime have own generated **id** and are displayed in own page with all information added in database
  * Upload anime into database with:
    * View Status (not necessary)
    * Date when added into list
    * Title
    * Episodes
    * Status (Out, Ongoing or Announced)
    * Date when anime was published
    * Source name (not necessary)
    * Link to source (not necessary)
    * Cover image
    * Description (not necessary)
  * Show recently added anime in main page
  * Find anime in database by title and published date
  * Upload characters into database with:
    * Name
    * Surname
    * Age
    * Anime related with
    * Image
    * Description
  * Find characters in database by name
  * Edit and Delete character or anime database/page
