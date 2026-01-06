# Consumet API Documentation

# /faq

**Source:** https://docs.consumet.org/faq

FAQ

## FREQUENTLY ASKED QUESTIONS

  

### How do I fix a source error (503)?

Add the relevant `User-Agent` header.

Add the following header to your video player request:

```javascript
{'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'}
```

### CORS causing trouble?

Use the Consumet CORS proxy.

Append the source link for the media to `https://cors.consumet.stream/`, like so:

```javascript
https://cors.consumet.stream/<SOURCE_LINK>
```

[List of Providers](/list-of-providers "List of Providers")[Get Started](/rest-api/start "Get Started")
---

# List of Providers

**Source:** https://docs.consumet.org/list-of-providers

List of Providers

# List of Providers

Consumet supports a wealth of API providers, which can be categorized into the following groups:

## Anime

[AnimePahe: (opens in a new tab)](https://animepahe.com) Often provides high quality anime streaming links.

[AnimeKai: (opens in a new tab)](https://animekai.to) A modern anime streaming site with MegaUp servers.

[AnimeSama: (opens in a new tab)](https://animesama.fr) French anime streaming provider.

[AnimeSaturn: (opens in a new tab)](https://animesaturn.cx) 🇮🇹 Italian anime streaming provider.

[AnimeUnity: (opens in a new tab)](https://animeunity.so) 🇮🇹 Italian anime streaming provider.

[HiAnime: (opens in a new tab)](https://hianime.to) High quality anime streaming with sub/dub options, spotlight, and schedule features.

[KickAssAnime: (opens in a new tab)](https://kickassanime.am) Anime streaming with multiple server options.

## Books

[Libgen: (opens in a new tab)](https://libgen.is) Currently the only provider for books - a vast library of e-books available for download.

## Comics

[GetComics: (opens in a new tab)](https://getcomics.info) Currently the only provider for comics - read & download comics for free online!

## Light Novels

[NovelUpdates: (opens in a new tab)](https://novelupdates.com) The most comprehensive light novel database with chapter links.

[Read Light Novels: (opens in a new tab)](https://readlightnovels.net) Read your favourite light novel series online here.

## Manga

[AsuraScans: (opens in a new tab)](https://asuracomic.net) Popular manhwa/manhua reading site with fast releases.

[ComicK: (opens in a new tab)](https://comick.io) Fast and comprehensive manga reading platform.

[Mangadex: (opens in a new tab)](https://mangadex.org) Hosts 10,000s of chapters of scanlated manga.

[Mangahere: (opens in a new tab)](https://mangahere.cc) English-translated manga for free online with rankings and trending.

[Mangakakalot: (opens in a new tab)](https://mangakakalot.com) Read manga online in English with search suggestions and genre filtering.

[Mangapill: (opens in a new tab)](https://mangapill.com) Your daily dose of manga!

[Mangareader: (opens in a new tab)](https://mangareader.to) A great provider for manga images with high quality scans.

[WeebCentral: (opens in a new tab)](https://weebcentral.com) Manga reading platform with a vast collection.

## Meta

[Anilist for Anime: (opens in a new tab)](https://anilist.co) A metadata provider used to aggregate anime data from Anilist, and to accurately map these anime to publicly-available streaming links.

[Anilist for Manga: (opens in a new tab)](https://anilist.co) A metadata provider used to aggregate manga data from Anilist, and to accurately map these manga to publicly-available streaming links.

[MyAnimeList: (opens in a new tab)](https://myanimelist.net) A metadata provider used to aggregate media (primarily anime & manga) data from MyAnimeList, and to accurately map these media to publicly-available streaming links.

[The Movie Database (TMDB): (opens in a new tab)](https://www.themoviedb.org) A metadata provider that returns data about current, past & upcoming TV shows/movies, and accurately map these media to publicly-available streaming links.

## Movies

[Dramacool: (opens in a new tab)](https://dramacool.ee) Provides mainly K-Dramas & other similar Asian content with spotlight features.

[FlixHQ: (opens in a new tab)](https://flixhq.to) Provides 1,000s of high-quality movies & series with spotlight and trending features.

[Goku: (opens in a new tab)](https://goku.sx) Movies & TV shows streaming with trending features.

[HiMovies: (opens in a new tab)](https://himovies.to) Movies & TV shows streaming platform.

[SFlix: (opens in a new tab)](https://sflix.to) Movies & TV shows with spotlight features.

[Turkish123: (opens in a new tab)](https://turkish123.ac) Turkish dramas and TV shows streaming.

## News

[AnimeNewsNetwork: (opens in a new tab)](https://animenewsnetwork.com) Serves 10s of stories regarding the latest Japanese media news per day: "The internet's most trusted anime news source."

[Introduction](/ "Introduction")[FAQ](/faq "FAQ")
---

# Get Started

**Source:** https://docs.consumet.org/node-library/start

Node Library

Get Started

# Get Started

The "consumet.ts" library, otherwise @consumet/extensions, is available via mainstream package managers.

## Installation

Instructions for installing the library can be found below.

```javascript
npm i @consumet/extensions
```

View package at [npmjs.com (opens in a new tab)](https://www.npmjs.com/package/@consumet/extensions)

[Fetch News Info](/rest-api/News/animenewsnetwork/fetch-news-info "Fetch News Info")
---

# Search by Genre

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/genre

API

Anime

AnimeKai

Search by Genre

# Search by Genre

Technical details regarding the usage of the search by genre function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/genre/{genre}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| genre | string | The genre to search for (e.g., "action", "comedy", "drama"). | Yes | `""` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example genre "action".
const url = "https://api.consumet.org/anime/animekai/genre/action";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Get Genre List](/rest-api/Anime/animekai/genre-list "Get Genre List")[Movies](/rest-api/Anime/animekai/movies "Movies")
---

# Get Genre List

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/genre-list

API

Anime

AnimeKai

Get Genre List

# Get Genre List

Technical details regarding the usage of the get genre list function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/genre/list
```

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/animekai/genre/list";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string"
    }
  ]
}
```

[Latest Completed](/rest-api/Anime/animekai/latest-completed "Latest Completed")[Search by Genre](/rest-api/Anime/animekai/genre "Search by Genre")
---

# Get Anime Info

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/get-anime-info

API

Anime

AnimeKai

Get Anime Info

# Get Anime Info

Technical details regarding the usage of the get anime info function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The animekai ID of the anime; i.e. provided by searching for said anime and selecting the correct one. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example ID of "naruto-shippuden-1".
const url = "https://api.consumet.org/anime/animekai/info";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { id: "naruto-shippuden-1" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "url": "string",
  "image": "string",
  "description": "string",
  "genres": ["string"],
  "subOrDub": "sub",
  "type": "string",
  "status": "string",
  "otherName": "string",
  "totalEpisodes": 0,
  "episodes": [
    {
      "id": "string",
      "number": 0,
      "title": "string",
      "url": "string"
    }
  ]
}
```

[Search](/rest-api/Anime/animekai/search "Search")[Get Episode Streaming Links](/rest-api/Anime/animekai/get-episode-streaming-links "Get Episode Streaming Links")
---

# Get Episode Servers

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/get-episode-servers

API

Anime

AnimeKai

Get Episode Servers

# Get Episode Servers

Technical details regarding the usage of the get episode servers function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/servers/{episodeId}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The episode ID of the episode to get available servers for. | Yes | `""` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| dub | boolean | Set to true for dubbed, false for subbed. | No | `false` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example episode ID of "naruto-shippuden-1-episode-1".
const url = "https://api.consumet.org/anime/animekai/servers/naruto-shippuden-1-episode-1";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { dub: false } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "name": "string",
    "url": "string"
  }
]
```

[Get Episode Streaming Links](/rest-api/Anime/animekai/get-episode-streaming-links "Get Episode Streaming Links")[Search Suggestions](/rest-api/Anime/animekai/search-suggestions "Search Suggestions")
---

# Get Episode Streaming Links

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/get-episode-streaming-links

API

Anime

AnimeKai

Get Episode Streaming Links

# Get Episode Streaming Links

Technical details regarding the usage of the get episode streaming links function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/watch/{episodeId}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The episode ID of the episode you want to watch. | Yes | `""` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| server | string | The streaming server to use (e.g., "vidstreaming", "vidcloud"). | No | `""` |
| dub | boolean | Set to true for dubbed, false for subbed. | No | `false` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example episode ID of "naruto-shippuden-1-episode-1".
const url = "https://api.consumet.org/anime/animekai/watch/naruto-shippuden-1-episode-1";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { server: "vidstreaming", dub: false } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "headers": {
    "Referer": "string",
    "User-Agent": "string"
  },
  "sources": [
    {
      "url": "string",
      "quality": "string",
      "isM3U8": true
    }
  ],
  "download": "string"
}
```

[Get Anime Info](/rest-api/Anime/animekai/get-anime-info "Get Anime Info")[Get Episode Servers](/rest-api/Anime/animekai/get-episode-servers "Get Episode Servers")
---

# Get Latest Completed Anime

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/latest-completed

API

Anime

AnimeKai

Latest Completed

# Get Latest Completed Anime

Technical details regarding the usage of the get latest completed anime function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/latest-completed
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/animekai/latest-completed";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[New Releases](/rest-api/Anime/animekai/new-releases "New Releases")[Get Genre List](/rest-api/Anime/animekai/genre-list "Get Genre List")
---

# Get Movies

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/movies

API

Anime

AnimeKai

Movies

# Get Movies

Technical details regarding the usage of the get movies function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/movies
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/animekai/movies";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Search by Genre](/rest-api/Anime/animekai/genre "Search by Genre")[TV Series](/rest-api/Anime/animekai/tv "TV Series")
---

# Get New Releases

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/new-releases

API

Anime

AnimeKai

New Releases

# Get New Releases

Technical details regarding the usage of the get new releases function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/new-releases
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/animekai/new-releases";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Recently Added](/rest-api/Anime/animekai/recent-added "Recently Added")[Latest Completed](/rest-api/Anime/animekai/latest-completed "Latest Completed")
---

# Get ONA Anime

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/ona

API

Anime

AnimeKai

ONA

# Get ONA Anime

Technical details regarding the usage of the get ONA (Original Net Animation) anime function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/ona
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/animekai/ona";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[OVA](/rest-api/Anime/animekai/ova "OVA")[Specials](/rest-api/Anime/animekai/specials "Specials")
---

# Get OVA Anime

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/ova

API

Anime

AnimeKai

OVA

# Get OVA Anime

Technical details regarding the usage of the get OVA (Original Video Animation) anime function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/ova
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/animekai/ova";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[TV Series](/rest-api/Anime/animekai/tv "TV Series")[ONA](/rest-api/Anime/animekai/ona "ONA")
---

# Get Recently Added Anime

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/recent-added

API

Anime

AnimeKai

Recently Added

# Get Recently Added Anime

Technical details regarding the usage of the get recently added anime function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/recent-added
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/animekai/recent-added";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Recent Episodes](/rest-api/Anime/animekai/recent-episodes "Recent Episodes")[New Releases](/rest-api/Anime/animekai/new-releases "New Releases")
---

# Get Recent Episodes

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/recent-episodes

API

Anime

AnimeKai

Recent Episodes

# Get Recent Episodes

Technical details regarding the usage of the get recent episodes function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/recent-episodes
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/animekai/recent-episodes";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "episodeNumber": 0,
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Schedule](/rest-api/Anime/animekai/schedule "Schedule")[Recently Added](/rest-api/Anime/animekai/recent-added "Recently Added")
---

# Get Schedule

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/schedule

API

Anime

AnimeKai

Schedule

# Get Schedule

Technical details regarding the usage of the get schedule function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/schedule/{date}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| date | string | The date to get schedule for (e.g., "monday", "tuesday", "today", etc.). | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example date "monday".
const url = "https://api.consumet.org/anime/animekai/schedule/monday";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "time": "string",
      "airingDay": "string"
    }
  ]
}
```

[Spotlight](/rest-api/Anime/animekai/spotlight "Spotlight")[Recent Episodes](/rest-api/Anime/animekai/recent-episodes "Recent Episodes")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/search

API

Anime

AnimeKai

Search

# Search

Technical details regarding the usage of the search function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes | `""` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "naruto".
const url = "https://api.consumet.org/anime/animekai/naruto";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Get Started](/rest-api/start "Get Started")[Get Anime Info](/rest-api/Anime/animekai/get-anime-info "Get Anime Info")
---

# Get Search Suggestions

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/search-suggestions

API

Anime

AnimeKai

Search Suggestions

# Get Search Suggestions

Technical details regarding the usage of the get search suggestions function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/search-suggestions/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query to get suggestions for. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "demon".
const url = "https://api.consumet.org/anime/animekai/search-suggestions/demon";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string"
    }
  ]
}
```

[Get Episode Servers](/rest-api/Anime/animekai/get-episode-servers "Get Episode Servers")[Spotlight](/rest-api/Anime/animekai/spotlight "Spotlight")
---

# Get Special Episodes

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/specials

API

Anime

AnimeKai

Specials

# Get Special Episodes

Technical details regarding the usage of the get special episodes function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/specials
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/animekai/specials";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[ONA](/rest-api/Anime/animekai/ona "ONA")[Search](/rest-api/Anime/animepahe/search "Search")
---

# Get Spotlight Anime

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/spotlight

API

Anime

AnimeKai

Spotlight

# Get Spotlight Anime

Technical details regarding the usage of the get spotlight anime function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/spotlight
```

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/animekai/spotlight";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "description": "string",
      "rank": 0
    }
  ]
}
```

[Search Suggestions](/rest-api/Anime/animekai/search-suggestions "Search Suggestions")[Schedule](/rest-api/Anime/animekai/schedule "Schedule")
---

# Get TV Series

**Source:** https://docs.consumet.org/rest-api/Anime/animekai/tv

API

Anime

AnimeKai

TV Series

# Get TV Series

Technical details regarding the usage of the get TV series function for the animekai provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animekai/tv
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/animekai/tv";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Movies](/rest-api/Anime/animekai/movies "Movies")[OVA](/rest-api/Anime/animekai/ova "OVA")
---

# Get Anime Episode Streaming Links

**Source:** https://docs.consumet.org/rest-api/Anime/animepahe/get-anime-episode-streaming-links

API

Anime

Animepahe

Get Anime Episode Streaming Links

# Get Anime Episode Streaming Links

Technical details regarding the usage of the get anime streaming links function for the animepahe provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animepahe/watch?episodeId={episodeId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The episode ID of the episode you want to watch. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
/*
Using the example episode ID of '2242c5d8ac108a8b5d0ac16bf2db82d55d5a578b2ed2e4ca0c6ed1b5dccc3e95"',
*/
const url = "https://api.consumet.org/anime/animepahe/watch";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { episodeId: "2242c5d8ac108a8b5d0ac16bf2db82d55d5a578b2ed2e4ca0c6ed1b5dccc3e95" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "headers": {
      "Referer": "string",
      "watchsb": "string", // or null, since only provided with server being equal to "streamsb".
      "User-Agent": "string" // or null
  },
  "sources": [
      {
      "url": "string",
      "quality": "string",
      "isM3U8": true
      }
  ]
}
```

[Get Anime Info](/rest-api/Anime/animepahe/get-anime-info "Get Anime Info")[Search](/rest-api/Anime/animesama/search "Search")
---

# Get Anime Info

**Source:** https://docs.consumet.org/rest-api/Anime/animepahe/get-anime-info

API

Anime

Animepahe

Get Anime Info

# Get Anime Info

Technical details regarding the usage of the get anime info function for the animepahe provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animepahe/info/{id}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The animepahe ID of the anime; i.e. provided by searching for said anime and selecting the correct one. | Yes |  |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodePage | integer | The page number of episodes to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example ID of "99318885-5a76-cfa6-3b99-57007bbb7673".
const url = "https://api.consumet.org/anime/animepahe/info/99318885-5a76-cfa6-3b99-57007bbb7673";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "url": "string",
  "image": "string",
  "releaseDate": "string", // or null
  "description": "string", // or null
  "genres": [
    "string"
  ],
  "subOrDub": "sub",
  "type": "string", // or null
  "status": "Ongoing",
  "otherName": "string", // or null
  "totalEpisodes": 0,
  "episodes": [
    {
      "id": "string",
      "number": 0,
      "url": "string"
    }
  ]
}
```

[Get Recent Episodes](/rest-api/Anime/animepahe/get-recent-episodes "Get Recent Episodes")[Get Anime Episode Streaming Links](/rest-api/Anime/animepahe/get-anime-episode-streaming-links "Get Anime Episode Streaming Links")
---

# Get Recent Episodes

**Source:** https://docs.consumet.org/rest-api/Anime/animepahe/get-recent-episodes

API

Anime

Animepahe

Get Recent Episodes

# Get Recent Episodes

Technical details regarding the usage of the get recent episodes function for the animepahe provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animepahe/recent-episodes?page={number}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Get the first page of recent episodes.
const url = "https://api.consumet.org/anime/animepahe/recent-episodes";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 0,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "episodeId": "string",
      "episodeNumber": 0,
      "title": "string",
      "image": "string",
      "url": "string"
    }
  ]
}
```

[Search](/rest-api/Anime/animepahe/search "Search")[Get Anime Info](/rest-api/Anime/animepahe/get-anime-info "Get Anime Info")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Anime/animepahe/search

API

Anime

Animepahe

Search

# Search

Technical details regarding the usage of the search function for the animepahe provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animepahe/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "demon".
const url = "https://api.consumet.org/anime/animepahe/demon";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 0,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "releaseDate": "string", // or null
      "subOrDub": "sub" // or "dub"
    }
  ]
}
```

[Specials](/rest-api/Anime/animekai/specials "Specials")[Get Recent Episodes](/rest-api/Anime/animepahe/get-recent-episodes "Get Recent Episodes")
---

# Get Anime Info

**Source:** https://docs.consumet.org/rest-api/Anime/animesama/get-anime-info

API

Anime

AnimeSama

Get Anime Info

# Get Anime Info

Technical details regarding the usage of the get anime info function for the AnimeSama provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animesama/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The AnimeSama ID of the anime; i.e. provided by searching for said anime and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example ID "naruto".
const url = "https://api.consumet.org/anime/animesama/info";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { id: "naruto" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "url": "string",
  "image": "string",
  "description": "string",
  "genres": ["string"],
  "episodes": [
    {
      "id": "string",
      "number": 0,
      "title": "string"
    }
  ]
}
```

[Search](/rest-api/Anime/animesama/search "Search")[Get Episode Streaming Links](/rest-api/Anime/animesama/get-episode-streaming-links "Get Episode Streaming Links")
---

# Get Episode Streaming Links

**Source:** https://docs.consumet.org/rest-api/Anime/animesama/get-episode-streaming-links

API

Anime

AnimeSama

Get Episode Streaming Links

# Get Episode Streaming Links

Technical details regarding the usage of the get episode streaming links function for the AnimeSama provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animesama/watch?episodeId={episodeId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The episode ID of the episode you want to watch. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example episode ID "naruto-episode-1".
const url = "https://api.consumet.org/anime/animesama/watch";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { episodeId: "naruto-episode-1" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "sources": [
    {
      "url": "string",
      "quality": "string",
      "isM3U8": true
    }
  ],
  "subtitles": [
    {
      "url": "string",
      "lang": "string"
    }
  ]
}
```

[Get Anime Info](/rest-api/Anime/animesama/get-anime-info "Get Anime Info")[Search](/rest-api/Anime/animesaturn/search "Search")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Anime/animesama/search

API

Anime

AnimeSama

Search

# Search

Technical details regarding the usage of the search function for the AnimeSama provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animesama/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the anime you are looking for. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "naruto".
const url = "https://api.consumet.org/anime/animesama/naruto";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": false,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string"
    }
  ]
}
```

[Get Anime Episode Streaming Links](/rest-api/Anime/animepahe/get-anime-episode-streaming-links "Get Anime Episode Streaming Links")[Get Anime Info](/rest-api/Anime/animesama/get-anime-info "Get Anime Info")
---

# Get Anime Info

**Source:** https://docs.consumet.org/rest-api/Anime/animesaturn/get-anime-info

API

Anime

AnimeSaturn

Get Anime Info

# Get Anime Info

Technical details regarding the usage of the get anime info function for the animesaturn provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animesaturn/info/{id}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The animesaturn ID of the anime; i.e. provided by searching for said anime and selecting the correct one. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example ID of "naruto".
const url = "https://api.consumet.org/anime/animesaturn/info/naruto";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "malID": "string",
  "alID": "string",
  "genres": ["string"],
  "image": "string",
  "cover": "string",
  "description": "string",
  "episodes": [
    {
      "id": "string",
      "number": 0
    }
  ]
}
```

[Search](/rest-api/Anime/animesaturn/search "Search")[Get Episode Streaming Links](/rest-api/Anime/animesaturn/get-episode-streaming-links "Get Episode Streaming Links")
---

# Get Episode Streaming Links

**Source:** https://docs.consumet.org/rest-api/Anime/animesaturn/get-episode-streaming-links

API

Anime

AnimeSaturn

Get Episode Streaming Links

# Get Episode Streaming Links

Technical details regarding the usage of the get episode streaming links function for the animesaturn provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animesaturn/watch/{episodeId}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The episode ID of the episode you want to watch. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example episode ID of "naruto-episodio-1".
const url = "https://api.consumet.org/anime/animesaturn/watch/naruto-episodio-1";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "headers": {},
  "sources": [
    {
      "url": "string",
      "isM3U8": true
    }
  ],
  "subtitles": [
    {
      "url": "string",
      "lang": "string"
    }
  ]
}
```

[Get Anime Info](/rest-api/Anime/animesaturn/get-anime-info "Get Anime Info")[Search](/rest-api/Anime/animeunity/search "Search")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Anime/animesaturn/search

API

Anime

AnimeSaturn

Search

# Search

Technical details regarding the usage of the search function for the animesaturn provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animesaturn/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "naruto".
const url = "https://api.consumet.org/anime/animesaturn/naruto";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "hasNextPage": false,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string"
    }
  ]
}
```

[Get Episode Streaming Links](/rest-api/Anime/animesama/get-episode-streaming-links "Get Episode Streaming Links")[Get Anime Info](/rest-api/Anime/animesaturn/get-anime-info "Get Anime Info")
---

# Get Anime Episode Streaming Links

**Source:** https://docs.consumet.org/rest-api/Anime/animeunity/get-anime-episode-streaming-links

API

Anime

AnimeUnity

Get Anime Episode Streaming Links

# Get Anime Episode Streaming Links

Technical details regarding the usage of the get anime streaming links function for the animeunity provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animeunity/watch/{episodeId}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The episode ID of the episode you want to watch. Format: `{animeId}-{slug}/{episodeNumber}` | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
/*
Using the example episode ID of "7221-demon-slayer-kimetsu-no-yaiba/12345"
*/
const url = "https://api.consumet.org/anime/animeunity/watch/7221-demon-slayer-kimetsu-no-yaiba/12345";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "sources": [
    {
      "url": "string",
      "quality": "string", // e.g., "360p", "480p", "720p", "1080p", "default"
      "isM3U8": true
    }
  ],
  "download": "string"
}
```

[Get Anime Info](/rest-api/Anime/animeunity/get-anime-info "Get Anime Info")[Search](/rest-api/Anime/hianime/search "Search")
---

# Get Anime Info

**Source:** https://docs.consumet.org/rest-api/Anime/animeunity/get-anime-info

API

Anime

AnimeUnity

Get Anime Info

# Get Anime Info

Technical details regarding the usage of the get anime info function for the animeunity provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animeunity/info/{id}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The animeunity ID of the anime; i.e. provided by searching for said anime and selecting the correct one. Format: `{animeId}-{slug}` | Yes |  |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of episodes to return (120 episodes per page). | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example ID of "7221-demon-slayer-kimetsu-no-yaiba".
const url = "https://api.consumet.org/anime/animeunity/info/7221-demon-slayer-kimetsu-no-yaiba";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": false,
  "totalPages": 1,
  "id": "string",
  "title": "string",
  "url": "string",
  "alID": "string", // AniList ID
  "genres": [
    "string"
  ],
  "totalEpisodes": 0,
  "image": "string",
  "cover": "string",
  "description": "string",
  "episodes": [
    {
      "id": "string",
      "number": 0,
      "url": "string"
    }
  ]
}
```

[Search](/rest-api/Anime/animeunity/search "Search")[Get Anime Episode Streaming Links](/rest-api/Anime/animeunity/get-anime-episode-streaming-links "Get Anime Episode Streaming Links")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Anime/animeunity/search

API

Anime

AnimeUnity

Search

# Search

Technical details regarding the usage of the search function for the animeunity provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/animeunity/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "demon slayer".
const url = "https://api.consumet.org/anime/animeunity/demon slayer";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "hasNextPage": false,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "cover": "string",
      "rating": 0,
      "releaseDate": "string",
      "subOrDub": "sub" // or "dub"
    }
  ]
}
```

[Get Episode Streaming Links](/rest-api/Anime/animesaturn/get-episode-streaming-links "Get Episode Streaming Links")[Get Anime Info](/rest-api/Anime/animeunity/get-anime-info "Get Anime Info")
---

# Advanced Search

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/advanced-search

API

Anime

HiAnime

Advanced Search

# Advanced Search

Technical details regarding the usage of the advanced search function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/advanced-search
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |
| type | string | The type of anime (e.g., "movie", "tv", "ova", "ona", "special"). | No | `""` |
| status | string | The status of anime (e.g., "currently-airing", "finished-airing"). | No | `""` |
| rated | string | The age rating (e.g., "r", "pg-13", "pg"). | No | `""` |
| score | number | The minimum score rating. | No | `""` |
| season | string | The season (e.g., "spring", "summer", "fall", "winter"). | No | `""` |
| language | string | The language type (e.g., "sub", "dub"). | No | `""` |
| startDate | string | Start date in YYYY-MM-DD format. | No | `""` |
| endDate | string | End date in YYYY-MM-DD format. | No | `""` |
| sort | string | Sort order (e.g., "recently-added", "most-popular"). | No | `""` |
| genres | string | Comma-separated list of genre names. | No | `""` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/advanced-search";
const data = async () => {
    try {
        const { data } = await axios.get(url, {
            params: {
                page: 1,
                type: "tv",
                status: "currently-airing",
                season: "fall",
                genres: "action,adventure"
            }
        });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "totalPages": 10,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Get Episode Streaming Links](/rest-api/Anime/hianime/get-episode-streaming-links "Get Episode Streaming Links")[Search Suggestions](/rest-api/Anime/hianime/search-suggestions "Search Suggestions")
---

# Dubbed Anime

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/dubbed-anime

API

Anime

HiAnime

Dubbed Anime

# Dubbed Anime

Technical details regarding the usage of the dubbed anime function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/dubbed-anime
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/dubbed-anime";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "dub"
    }
  ]
}
```

[Subbed Anime](/rest-api/Anime/hianime/subbed-anime "Subbed Anime")[Movies](/rest-api/Anime/hianime/movie "Movies")
---

# Genre

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/genre

API

Anime

HiAnime

Search by Genre

# Genre

Technical details regarding the usage of the genre search function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/genre/{genre}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| genre | string | The genre name to search for. | Yes | `""` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example genre "action".
const url = "https://api.consumet.org/anime/hianime/genre/action";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Get Genres](/rest-api/Anime/hianime/genres "Get Genres")[Search by Studio](/rest-api/Anime/hianime/studio "Search by Studio")
---

# Genres

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/genres

API

Anime

HiAnime

Get Genres

# Genres

Technical details regarding the usage of the genres function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/genres
```

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/genres";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "id": "string",
    "name": "string"
  }
]
```

[Top Upcoming](/rest-api/Anime/hianime/top-upcoming "Top Upcoming")[Search by Genre](/rest-api/Anime/hianime/genre "Search by Genre")
---

# Get Anime Info

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/get-anime-info

API

Anime

HiAnime

Get Anime Info

# Get Anime Info

Technical details regarding the usage of the get anime info function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The hianime ID of the anime; i.e. provided by searching for said anime and selecting the correct one. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example ID of "one-piece-100".
const url = "https://api.consumet.org/anime/hianime/info";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { id: "one-piece-100" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "url": "string",
  "image": "string",
  "description": "string",
  "genres": ["string"],
  "subOrDub": "sub",
  "type": "string",
  "status": "string",
  "otherName": "string",
  "totalEpisodes": 0,
  "episodes": [
    {
      "id": "string",
      "number": 0,
      "title": "string",
      "url": "string"
    }
  ]
}
```

[Search](/rest-api/Anime/hianime/search "Search")[Get Episode Streaming Links](/rest-api/Anime/hianime/get-episode-streaming-links "Get Episode Streaming Links")
---

# Get Episode Streaming Links

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/get-episode-streaming-links

API

Anime

HiAnime

Get Episode Streaming Links

# Get Episode Streaming Links

Technical details regarding the usage of the get episode streaming links function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/watch/{episodeId}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The episode ID of the episode you want to watch. | Yes | `""` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| server | string | The streaming server to use (e.g., "vidstreaming", "vidcloud"). | No | `""` |
| category | string | The category type: "sub" for subbed, "dub" for dubbed. | No | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example episode ID of "one-piece-100?ep=1234".
const url = "https://api.consumet.org/anime/hianime/watch/one-piece-100?ep=1234";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { server: "vidstreaming", category: "sub" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "headers": {
    "Referer": "string",
    "User-Agent": "string"
  },
  "sources": [
    {
      "url": "string",
      "quality": "string",
      "isM3U8": true
    }
  ],
  "download": "string"
}
```

[Get Anime Info](/rest-api/Anime/hianime/get-anime-info "Get Anime Info")[Advanced Search](/rest-api/Anime/hianime/advanced-search "Advanced Search")
---

# Latest Completed

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/latest-completed

API

Anime

HiAnime

Latest Completed

# Latest Completed

Technical details regarding the usage of the latest completed function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/latest-completed
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/latest-completed";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Most Favorite](/rest-api/Anime/hianime/most-favorite "Most Favorite")[Recently Updated](/rest-api/Anime/hianime/recently-updated "Recently Updated")
---

# Most Favorite

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/most-favorite

API

Anime

HiAnime

Most Favorite

# Most Favorite

Technical details regarding the usage of the most favorite function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/most-favorite
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/most-favorite";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Most Popular](/rest-api/Anime/hianime/most-popular "Most Popular")[Latest Completed](/rest-api/Anime/hianime/latest-completed "Latest Completed")
---

# Most Popular

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/most-popular

API

Anime

HiAnime

Most Popular

# Most Popular

Technical details regarding the usage of the most popular function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/most-popular
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/most-popular";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Top Airing](/rest-api/Anime/hianime/top-airing "Top Airing")[Most Favorite](/rest-api/Anime/hianime/most-favorite "Most Favorite")
---

# Movie

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/movie

API

Anime

HiAnime

Movies

# Movie

Technical details regarding the usage of the movie function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/movie
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/movie";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Dubbed Anime](/rest-api/Anime/hianime/dubbed-anime "Dubbed Anime")[TV Series](/rest-api/Anime/hianime/tv "TV Series")
---

# ONA

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/ona

API

Anime

HiAnime

ONA

# ONA

Technical details regarding the usage of the ONA function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/ona
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/ona";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[OVA](/rest-api/Anime/hianime/ova "OVA")[Special](/rest-api/Anime/hianime/special "Special")
---

# OVA

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/ova

API

Anime

HiAnime

OVA

# OVA

Technical details regarding the usage of the OVA function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/ova
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/ova";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[TV Series](/rest-api/Anime/hianime/tv "TV Series")[ONA](/rest-api/Anime/hianime/ona "ONA")
---

# Recently Added

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/recently-added

API

Anime

HiAnime

Recently Added

# Recently Added

Technical details regarding the usage of the recently added function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/recently-added
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/recently-added";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Recently Updated](/rest-api/Anime/hianime/recently-updated "Recently Updated")[Top Upcoming](/rest-api/Anime/hianime/top-upcoming "Top Upcoming")
---

# Recently Updated

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/recently-updated

API

Anime

HiAnime

Recently Updated

# Recently Updated

Technical details regarding the usage of the recently updated function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/recently-updated
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/recently-updated";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Latest Completed](/rest-api/Anime/hianime/latest-completed "Latest Completed")[Recently Added](/rest-api/Anime/hianime/recently-added "Recently Added")
---

# Schedule

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/schedule

API

Anime

HiAnime

Schedule

# Schedule

Technical details regarding the usage of the schedule function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/schedule
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| date | string | The date in YYYY-MM-DD format to get schedule for. | No | `""` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/schedule";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { date: "2024-01-15" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "scheduledAnimes": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "time": "string"
    }
  ]
}
```

[Special](/rest-api/Anime/hianime/special "Special")[Spotlight](/rest-api/Anime/hianime/spotlight "Spotlight")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/search

API

Anime

HiAnime

Search

# Search

Technical details regarding the usage of the search function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes | `""` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "one piece".
const url = "https://api.consumet.org/anime/hianime/one%20piece";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Get Anime Episode Streaming Links](/rest-api/Anime/animeunity/get-anime-episode-streaming-links "Get Anime Episode Streaming Links")[Get Anime Info](/rest-api/Anime/hianime/get-anime-info "Get Anime Info")
---

# Search Suggestions

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/search-suggestions

API

Anime

HiAnime

Search Suggestions

# Search Suggestions

Technical details regarding the usage of the search suggestions function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/search-suggestions/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query to get suggestions for. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "one piece".
const url = "https://api.consumet.org/anime/hianime/search-suggestions/one%20piece";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "suggestions": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "url": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Advanced Search](/rest-api/Anime/hianime/advanced-search "Advanced Search")[Top Airing](/rest-api/Anime/hianime/top-airing "Top Airing")
---

# Special

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/special

API

Anime

HiAnime

Special

# Special

Technical details regarding the usage of the special function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/special
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/special";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[ONA](/rest-api/Anime/hianime/ona "ONA")[Schedule](/rest-api/Anime/hianime/schedule "Schedule")
---

# Spotlight

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/spotlight

API

Anime

HiAnime

Spotlight

# Spotlight

Technical details regarding the usage of the spotlight function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/spotlight
```

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/spotlight";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "spotlightAnimes": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "description": "string",
      "rank": 0
    }
  ]
}
```

[Schedule](/rest-api/Anime/hianime/schedule "Schedule")[Search](/rest-api/Anime/kickassanime/search "Search")
---

# Studio

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/studio

API

Anime

HiAnime

Search by Studio

# Studio

Technical details regarding the usage of the studio search function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/studio/{studio}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| studio | string | The name of the studio to search for. | Yes | `""` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example studio "mappa".
const url = "https://api.consumet.org/anime/hianime/studio/mappa";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Search by Genre](/rest-api/Anime/hianime/genre "Search by Genre")[Subbed Anime](/rest-api/Anime/hianime/subbed-anime "Subbed Anime")
---

# Subbed Anime

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/subbed-anime

API

Anime

HiAnime

Subbed Anime

# Subbed Anime

Technical details regarding the usage of the subbed anime function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/subbed-anime
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/subbed-anime";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Search by Studio](/rest-api/Anime/hianime/studio "Search by Studio")[Dubbed Anime](/rest-api/Anime/hianime/dubbed-anime "Dubbed Anime")
---

# Top Airing

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/top-airing

API

Anime

HiAnime

Top Airing

# Top Airing

Technical details regarding the usage of the top airing function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/top-airing
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/top-airing";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Search Suggestions](/rest-api/Anime/hianime/search-suggestions "Search Suggestions")[Most Popular](/rest-api/Anime/hianime/most-popular "Most Popular")
---

# Top Upcoming

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/top-upcoming

API

Anime

HiAnime

Top Upcoming

# Top Upcoming

Technical details regarding the usage of the top upcoming function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/top-upcoming
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/top-upcoming";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Recently Added](/rest-api/Anime/hianime/recently-added "Recently Added")[Get Genres](/rest-api/Anime/hianime/genres "Get Genres")
---

# TV

**Source:** https://docs.consumet.org/rest-api/Anime/hianime/tv

API

Anime

HiAnime

TV Series

# TV

Technical details regarding the usage of the TV function for the hianime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/hianime/tv
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/anime/hianime/tv";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub"
    }
  ]
}
```

[Movies](/rest-api/Anime/hianime/movie "Movies")[OVA](/rest-api/Anime/hianime/ova "OVA")
---

# Get Anime Info

**Source:** https://docs.consumet.org/rest-api/Anime/kickassanime/get-anime-info

API

Anime

KickAssAnime

Get Anime Info

# Get Anime Info

Technical details regarding the usage of the get anime info function for the KickAssAnime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/kickassanime/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The KickAssAnime ID (slug) of the anime; i.e. provided by searching for said anime and selecting the correct one. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example ID of "naruto-f3cf".
const url = "https://api.consumet.org/anime/kickassanime/info";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { id: "naruto-f3cf" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "url": "string",
  "genres": ["string"],
  "totalEpisodes": 220,
  "image": "string",
  "cover": "string",
  "description": "string",
  "episodes": [
    {
      "id": "string",
      "title": "string",
      "number": 1,
      "image": "string",
      "url": "string"
    }
  ],
  "subOrDub": "sub",
  "type": "TV",
  "status": "Completed",
  "otherName": "string",
  "releaseDate": "string"
}
```

[Search](/rest-api/Anime/kickassanime/search "Search")[Get Episode Streaming Links](/rest-api/Anime/kickassanime/get-episode-streaming-links "Get Episode Streaming Links")
---

# Get Episode Servers

**Source:** https://docs.consumet.org/rest-api/Anime/kickassanime/get-episode-servers

API

Anime

KickAssAnime

Get Episode Servers

# Get Episode Servers

Technical details regarding the usage of the get episode servers function for the KickAssAnime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/kickassanime/servers?episodeId={episodeId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The episode ID/path of the episode (e.g., "naruto-f3cf/episode/ep-1-12cd96"). | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example episode ID of "naruto-f3cf/episode/ep-1-12cd96".
const url = "https://api.consumet.org/anime/kickassanime/servers";
const data = async () => {
    try {
        const { data } = await axios.get(url, {
            params: { episodeId: "naruto-f3cf/episode/ep-1-12cd96" }
        });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "name": "VidStreaming",
    "url": "string"
  },
  {
    "name": "BirdStream",
    "url": "string"
  },
  {
    "name": "DuckStream",
    "url": "string"
  }
]
```

[Get Episode Streaming Links](/rest-api/Anime/kickassanime/get-episode-streaming-links "Get Episode Streaming Links")[Search](/rest-api/Books/libgen/search "Search")
---

# Get Episode Streaming Links

**Source:** https://docs.consumet.org/rest-api/Anime/kickassanime/get-episode-streaming-links

API

Anime

KickAssAnime

Get Episode Streaming Links

# Get Episode Streaming Links

Technical details regarding the usage of the get episode streaming links function for the KickAssAnime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/kickassanime/watch?episodeId={episodeId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The episode ID/path of the episode you want to watch (e.g., "naruto-f3cf/episode/ep-1-12cd96"). | Yes | `""` |
| server | string | The streaming server to use (e.g., "VidStreaming", "BirdStream", "DuckStream", "CatStream"). | No | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example episode ID of "naruto-f3cf/episode/ep-1-12cd96".
const url = "https://api.consumet.org/anime/kickassanime/watch";
const data = async () => {
    try {
        const { data } = await axios.get(url, {
            params: {
                episodeId: "naruto-f3cf/episode/ep-1-12cd96",
                server: "VidStreaming"
            }
        });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "sources": [
    {
      "url": "string",
      "quality": "1080p",
      "isM3U8": true
    }
  ],
  "subtitles": [
    {
      "url": "string",
      "lang": "English"
    }
  ],
  "headers": {
    "Referer": "string",
    "User-Agent": "string"
  }
}
```

[Get Anime Info](/rest-api/Anime/kickassanime/get-anime-info "Get Anime Info")[Get Episode Servers](/rest-api/Anime/kickassanime/get-episode-servers "Get Episode Servers")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Anime/kickassanime/search

API

Anime

KickAssAnime

Search

# Search

Technical details regarding the usage of the search function for the KickAssAnime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/anime/kickassanime/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes | `""` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "naruto".
const url = "https://api.consumet.org/anime/kickassanime/naruto";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "totalPages": 10,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string",
      "subOrDub": "sub",
      "status": "Completed",
      "otherName": "string",
      "totalEpisodes": 220
    }
  ]
}
```

[Spotlight](/rest-api/Anime/hianime/spotlight "Spotlight")[Get Anime Info](/rest-api/Anime/kickassanime/get-anime-info "Get Anime Info")
---

# Get Book Info

**Source:** https://docs.consumet.org/rest-api/Books/libgen/get-book-info

API

Books

Libgen

Get Book Info

# Get Book Info

[Search](/rest-api/Books/libgen/search "Search")[Welcome](/rest-api/Comics/getcomics/welcome "Welcome")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Books/libgen/search

API

Books

Libgen

Search

# Search

Technical details regarding the usage of the search function for the libgen provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/books/libgen/s
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| bookTitle | string | The title of the book to search for. | Yes | `""` |
| page | integer | The page number of results to return. | No | `1` |

**Note:** `bookTitle` must be at least 4 characters long.

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "harry potter".
const url = "https://api.consumet.org/books/libgen/s";
const data = async () => {
    try {
        const { data } = await axios.get(url, {
            params: {
                bookTitle: "harry potter",
                page: 1
            }
        });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "author": "string",
      "publisher": "string",
      "year": "string",
      "language": "string",
      "extension": "string",
      "fileSize": "string",
      "downloads": "number"
    }
  ]
}
```

[Get Episode Servers](/rest-api/Anime/kickassanime/get-episode-servers "Get Episode Servers")[Get Book Info](/rest-api/Books/libgen/get-book-info "Get Book Info")
---

# Get Comic Info

**Source:** https://docs.consumet.org/rest-api/Comics/getcomics/get-comic-info

API

Comics

GetComics

Get Comic Info

# Get Comic Info

[Search](/rest-api/Comics/getcomics/search "Search")[Search](/rest-api/Meta/anilist-anime/search "Search")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Comics/getcomics/search

API

Comics

GetComics

Search

# Search

Technical details regarding the usage of the search function for the GetComics provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/comics/getcomics/s
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| comicTitle | string | The title of the comic you are looking for (minimum 4 characters). | Yes | `""` |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "spider man".
const url = "https://api.consumet.org/comics/getcomics/s";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { comicTitle: "spider man", page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "url": "string"
    }
  ],
  "currentPage": 1,
  "hasNextPage": true
}
```

[Welcome](/rest-api/Comics/getcomics/welcome "Welcome")[Get Comic Info](/rest-api/Comics/getcomics/get-comic-info "Get Comic Info")
---

# Welcome

**Source:** https://docs.consumet.org/rest-api/Comics/getcomics/welcome

API

Comics

GetComics

Welcome

# Welcome

This endpoint provides general information about the GetComics provider and lists available routes.

## Route Schema (URL)

```javascript
https://api.consumet.org/comics/getcomics
```

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/comics/getcomics";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "intro": "Welcome to the getComics provider: check out the provider's website @ https://getcomics.info/",
  "routes": ["/s"],
  "documentation": "https://docs.consumet.org/#tag/getComics"
}
```

[Get Book Info](/rest-api/Books/libgen/get-book-info "Get Book Info")[Search](/rest-api/Comics/getcomics/search "Search")
---

# Get Light Novel Info

**Source:** https://docs.consumet.org/rest-api/Light-Novels/novelupdates/get-light-novel-info

API

Light Novels

NovelUpdates

Get Light Novel Info

# Get Light Novel Info

Technical details regarding the usage of the get light novel info function for the NovelUpdates provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/light-novels/novelupdates/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The id of the light novel. | Yes | - |
| chapterPage | integer | The page number of chapters to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/light-novels/novelupdates/info";
const data = async () => {
    try {
        const { data } = await axios.get(url, {
            params: {
                id: "solo-leveling",
                chapterPage: 1
            }
        });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "url": "string",
  "image": "string",
  "description": "string",
  "genres": ["string"],
  "status": "string",
  "authors": ["string"],
  "chapters": [
    {
      "id": "string",
      "title": "string",
      "url": "string"
    }
  ]
}
```

[Search](/rest-api/Light-Novels/novelupdates/search "Search")[Read Chapter](/rest-api/Light-Novels/novelupdates/read-chapter "Read Chapter")
---

# Read Chapter

**Source:** https://docs.consumet.org/rest-api/Light-Novels/novelupdates/read-chapter

API

Light Novels

NovelUpdates

Read Chapter

# Read Chapter

Technical details regarding the usage of the read chapter function for the NovelUpdates provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/light-novels/novelupdates/read?chapterId={chapterId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| chapterId | string | The id of the chapter to fetch content from. | Yes | - |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/light-novels/novelupdates/read";
const data = async () => {
    try {
        const { data } = await axios.get(url, {
            params: {
                chapterId: "solo-leveling-chapter-1"
            }
        });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "title": "string",
  "content": "string"
}
```

[Get Light Novel Info](/rest-api/Light-Novels/novelupdates/get-light-novel-info "Get Light Novel Info")[Search](/rest-api/Manga/mangadex/search "Search")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Light-Novels/novelupdates/search

API

Light Novels

NovelUpdates

Search

# Search

Technical details regarding the usage of the search function for the NovelUpdates provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/light-novels/novelupdates/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the light novel you are looking for. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "solo leveling".
const url = "https://api.consumet.org/light-novels/novelupdates/solo%20leveling";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": false,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string"
    }
  ]
}
```

[Get Light Novel Chapter](/rest-api/Light-Novels/read-light-novels/get-light-novel-chapter "Get Light Novel Chapter")[Get Light Novel Info](/rest-api/Light-Novels/novelupdates/get-light-novel-info "Get Light Novel Info")
---

# Get Light Novel Chapter

**Source:** https://docs.consumet.org/rest-api/Light-Novels/read-light-novels/get-light-novel-chapter

API

Light Novels

Read Light Novels

Get Light Novel Chapter

# Get Light Novel Chapter

Technical details regarding the usage of the get light novel chapter function for the Read Light Novels provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/light-novels/readlightnovels/read
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| chapterId | string | The id of the chapter to fetch content from. | Yes | - |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/light-novels/readlightnovels/read";
const data = async () => {
    try {
        const { data } = await axios.get(url, {
            params: {
                chapterId: "solo-leveling-chapter-1"
            }
        });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "chapterId": "string",
  "chapterTitle": "string",
  "content": "string"
}
```

[Get Light Novel Info](/rest-api/Light-Novels/read-light-novels/get-light-novel-info "Get Light Novel Info")[Search](/rest-api/Light-Novels/novelupdates/search "Search")
---

# Get Light Novel Info

**Source:** https://docs.consumet.org/rest-api/Light-Novels/read-light-novels/get-light-novel-info

API

Light Novels

Read Light Novels

Get Light Novel Info

# Get Light Novel Info

Technical details regarding the usage of the get light novel info function for the Read Light Novels provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/light-novels/readlightnovels/info
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The id of the light novel. | Yes | - |
| chapterPage | integer | The page number of chapters to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/light-novels/readlightnovels/info";
const data = async () => {
    try {
        const { data } = await axios.get(url, {
            params: {
                id: "solo-leveling-1597",
                chapterPage: 1
            }
        });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "cover": "string",
  "author": "string",
  "description": "string",
  "genres": ["string"],
  "status": "string",
  "chapters": [
    {
      "id": "string",
      "title": "string",
      "releaseDate": "string"
    }
  ]
}
```

[Search](/rest-api/Light-Novels/read-light-novels/search "Search")[Get Light Novel Chapter](/rest-api/Light-Novels/read-light-novels/get-light-novel-chapter "Get Light Novel Chapter")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Light-Novels/read-light-novels/search

API

Light Novels

Read Light Novels

Search

# Search

Technical details regarding the usage of the search function for the Read Light Novels provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/light-novels/readlightnovels/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the light novel you are looking for. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "solo leveling".
const url = "https://api.consumet.org/light-novels/readlightnovels/solo%20leveling";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "author": "string"
    }
  ]
}
```

[Get Trending](/rest-api/Meta/the-movie-database/get-trending-movies "Get Trending")[Get Light Novel Info](/rest-api/Light-Novels/read-light-novels/get-light-novel-info "Get Light Novel Info")
---

# Get Manga Chapter Pages

**Source:** https://docs.consumet.org/rest-api/Manga/asurascans/get-manga-chapter-pages

API

Manga

AsuraScans

Get Manga Chapter Pages

# Get Manga Chapter Pages

Technical details regarding the usage of the get manga chapter pages function for the AsuraScans provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/asurascans/read?chapterId={chapterId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| chapterId | string | The AsuraScans chapter ID; i.e. provided by fetching manga info and selecting the desired chapter. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example chapter ID of "solo-leveling-chapter-1"
const url = "https://api.consumet.org/manga/asurascans/read?chapterId=solo-leveling-chapter-1";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "page": 1,
    "img": "string"
  },
  {
    "page": 2,
    "img": "string"
  }
]
```

[Get Manga Info](/rest-api/Manga/asurascans/get-manga-info "Get Manga Info")[Image Proxy](/rest-api/Manga/asurascans/proxy "Image Proxy")
---

# Get Manga Info

**Source:** https://docs.consumet.org/rest-api/Manga/asurascans/get-manga-info

API

Manga

AsuraScans

Get Manga Info

# Get Manga Info

Technical details regarding the usage of the get manga info function for the AsuraScans provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/asurascans/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The AsuraScans ID/slug of the manga; i.e. provided by searching for said manga and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example ID of "solo-leveling".
const url = "https://api.consumet.org/manga/asurascans/info?id=solo-leveling";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "altTitles": ["string"],
  "description": "string",
  "genres": ["string"],
  "status": "string",
  "image": "string",
  "authors": ["string"],
  "chapters": [
    {
      "id": "string",
      "title": "string",
      "chapterNumber": "string",
      "releasedDate": "string"
    }
  ]
}
```

[Search](/rest-api/Manga/asurascans/search "Search")[Get Manga Chapter Pages](/rest-api/Manga/asurascans/get-manga-chapter-pages "Get Manga Chapter Pages")
---

# Image Proxy

**Source:** https://docs.consumet.org/rest-api/Manga/asurascans/proxy

API

Manga

AsuraScans

Image Proxy

# Image Proxy

Technical details regarding the usage of the image proxy function for the AsuraScans provider can be found below. This endpoint is used to bypass CORS and hotlink protection when loading manga images. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/asurascans/proxy?url={url}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| url | string | The image URL to proxy (must be a valid AsuraScans image) | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example image URL
const imageUrl = "https://gg.asuracomic.net/storage/media/123/example.jpg";
const url = `https://api.consumet.org/manga/asurascans/proxy?url=${encodeURIComponent(imageUrl)}`;
 
const data = async () => {
    try {
        const { data } = await axios.get(url, { responseType: 'arraybuffer' });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Usage in HTML

You can also use the proxy URL directly in an `<img>` tag:

```javascript
<img src="https://api.consumet.org/manga/asurascans/proxy?url=https%3A%2F%2Fgg.asuracomic.net%2Fstorage%2Fmedia%2F123%2Fexample.jpg" alt="Manga Page" />
```

## Response Schema

**MIME Type:** `image/jpeg` (or appropriate image type)

Returns the raw image binary data with appropriate headers:

* `Content-Type`: The original image content type
* `Cache-Control`: `public, max-age=86400`
* `Access-Control-Allow-Origin`: `*`

[Get Manga Chapter Pages](/rest-api/Manga/asurascans/get-manga-chapter-pages "Get Manga Chapter Pages")[Search](/rest-api/Manga/weebcentral/search "Search")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Manga/asurascans/search

API

Manga

AsuraScans

Search

# Search

Technical details regarding the usage of the search function for the AsuraScans provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/asurascans/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the manhwa/manhua you are looking for. | Yes |  |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | number | The page number of results to return | No | 1 |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "solo leveling".
const url = "https://api.consumet.org/manga/asurascans/solo leveling";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "image": "string"
    }
  ]
}
```

[Image Proxy](/rest-api/Manga/comick/proxy "Image Proxy")[Get Manga Info](/rest-api/Manga/asurascans/get-manga-info "Get Manga Info")
---

# Get Manga Chapter Pages

**Source:** https://docs.consumet.org/rest-api/Manga/comick/get-manga-chapter-pages

API

Manga

ComicK

Get Manga Chapter Pages

# Get Manga Chapter Pages

Technical details regarding the usage of the get manga chapter pages function for the ComicK provider can be found below.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/comick/read?chapterId={chapterId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| chapterId | string | The chapter ID from the manga info endpoint. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/manga/comick/read";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { chapterId: "chapter-id-here" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "page": 1,
    "img": "string"
  }
]
```

[Get Manga Info](/rest-api/Manga/comick/get-manga-info "Get Manga Info")[Image Proxy](/rest-api/Manga/comick/proxy "Image Proxy")
---

# Get Manga Info

**Source:** https://docs.consumet.org/rest-api/Manga/comick/get-manga-info

API

Manga

ComicK

Get Manga Info

# Get Manga Info

Technical details regarding the usage of the get manga info function for the ComicK provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/comick/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The ComicK ID/slug of the manga; i.e. provided by searching for said manga and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example ID.
const url = "https://api.consumet.org/manga/comick/info";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { id: "solo-leveling" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "altTitles": ["string"],
  "description": "string",
  "genres": ["string"],
  "status": "string",
  "image": "string",
  "authors": ["string"],
  "chapters": [
    {
      "id": "string",
      "title": "string",
      "chapterNumber": "string",
      "releasedDate": "string"
    }
  ]
}
```

[Search](/rest-api/Manga/comick/search "Search")[Get Manga Chapter Pages](/rest-api/Manga/comick/get-manga-chapter-pages "Get Manga Chapter Pages")
---

# Image Proxy

**Source:** https://docs.consumet.org/rest-api/Manga/comick/proxy

API

Manga

ComicK

Image Proxy

# Image Proxy

Proxy manga images to bypass CORS and hotlink protection. Use this endpoint to display manga images in your application.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/comick/proxy?url={imageUrl}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| url | string | The image URL to proxy | Yes |  |

## Request Samples

```javascript
const imageUrl = "https://example.com/manga-image.jpg";
const proxyUrl = `https://api.consumet.org/manga/comick/proxy?url=${encodeURIComponent(imageUrl)}`;
 
// Use in img tag
const img = document.createElement('img');
img.src = proxyUrl;
```

## Response Schema

**MIME Type:** `image/jpeg` or `image/png` or `image/webp`

Returns the binary image data with appropriate content-type header.

[Get Manga Chapter Pages](/rest-api/Manga/comick/get-manga-chapter-pages "Get Manga Chapter Pages")[Search](/rest-api/Manga/asurascans/search "Search")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Manga/comick/search

API

Manga

ComicK

Search

# Search

Technical details regarding the usage of the search function for the ComicK provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/comick/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the manga you are looking for. | Yes |  |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| cursor | string | Cursor for pagination (use next\_cursor from previous response) | No |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "solo leveling".
const url = "https://api.consumet.org/manga/comick/solo leveling";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "altTitles": ["string"],
      "image": "string"
    }
  ],
  "next_cursor": "string",
  "prev_cursor": "string"
}
```

[Image Proxy](/rest-api/Manga/mangakakalot/proxy "Image Proxy")[Get Manga Info](/rest-api/Manga/comick/get-manga-info "Get Manga Info")
---

# Get Manga Chapter Pages

**Source:** https://docs.consumet.org/rest-api/Manga/mangadex/get-manga-chapter-pages

API

Manga

Mangadex

Get Manga Chapter Pages

# Get Manga Chapter Pages

Technical details regarding the usage of the get manga chapter pages function for the mangadex provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangadex/read/5f7891b4-f048-4516-9c75-7bcd6dbd1451/{chapterId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| chapterId | string | The mangadex ID of the chapter; i.e. provided by searching for said anime and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example chapter ID of "5f7891b4-f048-4516-9c75-7bcd6dbd1451"
const url = "https://api.consumet.org/manga/mangadex/read/5f7891b4-f048-4516-9c75-7bcd6dbd1451";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "page": number,
    "img": "string",
    "headerForImage": "string"
  },
  ...
]
```

[Get Manga Info](/rest-api/Manga/mangadex/get-manga-info "Get Manga Info")[Random Manga](/rest-api/Manga/mangadex/random "Random Manga")
---

# Get Manga Info

**Source:** https://docs.consumet.org/rest-api/Manga/mangadex/get-manga-info

API

Manga

Mangadex

Get Manga Info

# Get Manga Info

Technical details regarding the usage of the get manga info function for the mangadex provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangadex/info/{id}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The mangadex ID of the manga; i.e. provided by searching for said manga and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example ID of "259dfd8a-f06a-4825-8fa6-a2dcd7274230".
const url = "https://api.consumet.org/manga/mangadex/info/259dfd8a-f06a-4825-8fa6-a2dcd7274230";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "altTitles": ["string"], // or null
  "genres": ["string"], // or null
  "headerForImage": "string", // or null
  "image": "string", // or null
  "chapters": [
    {
      "id": "string",
      "title": "string",
      "releaseDate": "string" // or null
    }
  ]
}
```

[Search](/rest-api/Manga/mangadex/search "Search")[Get Manga Chapter Pages](/rest-api/Manga/mangadex/get-manga-chapter-pages "Get Manga Chapter Pages")
---

# Latest Updates

**Source:** https://docs.consumet.org/rest-api/Manga/mangadex/latest

API

Manga

Mangadex

Latest Updates

# Latest Updates

Technical details regarding the usage of the latest updates function for the mangadex provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangadex/latest?page={page}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | number | The page number of results to return. | No | 1 |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example page of 1.
const url = "https://api.consumet.org/manga/mangadex/latest";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "altTitles": ["string"],
      "headerForImage": { "Referer": "string" },
      "image": "string"
    }
  ]
}
```

[Recently Added](/rest-api/Manga/mangadex/recent "Recently Added")[Popular](/rest-api/Manga/mangadex/popular "Popular")
---

# Popular Manga

**Source:** https://docs.consumet.org/rest-api/Manga/mangadex/popular

API

Manga

Mangadex

Popular

# Popular Manga

Technical details regarding the usage of the popular manga function for the mangadex provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangadex/popular?page={page}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | number | The page number of results to return. | No | 1 |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example page of 1.
const url = "https://api.consumet.org/manga/mangadex/popular";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "altTitles": ["string"],
      "headerForImage": { "Referer": "string" },
      "image": "string"
    }
  ]
}
```

[Latest Updates](/rest-api/Manga/mangadex/latest "Latest Updates")[Image Proxy](/rest-api/Manga/mangadex/proxy "Image Proxy")
---

# Image Proxy

**Source:** https://docs.consumet.org/rest-api/Manga/mangadex/proxy

API

Manga

Mangadex

Image Proxy

# Image Proxy

Technical details regarding the usage of the image proxy function for the mangadex provider can be found below. This endpoint proxies manga images to bypass CORS and hotlink protection. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangadex/proxy?url={url}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| url | string | The image URL to proxy (URL encoded). | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using an example MangaDex image URL.
const imageUrl = "https://uploads.mangadex.org/covers/example.jpg";
const url = `https://api.consumet.org/manga/mangadex/proxy?url=${encodeURIComponent(imageUrl)}`;
 
const data = async () => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return response.data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
// Returns image binary data
console.log(data);
```

## Usage in HTML

You can use this proxy directly in HTML img tags:

```javascript
<img src="https://api.consumet.org/manga/mangadex/proxy?url=YOUR_ENCODED_IMAGE_URL" alt="Manga Image" />
```

## Response Schema

**MIME Type:** `image/jpeg` or `image/png` (depends on the original image)

Returns the binary image data with appropriate headers:

* `Content-Type`: The content type of the proxied image
* `Cache-Control`: `public, max-age=86400`
* `Access-Control-Allow-Origin`: `*`

[Popular](/rest-api/Manga/mangadex/popular "Popular")[Search](/rest-api/Manga/mangahere/search "Search")
---

# Random Manga

**Source:** https://docs.consumet.org/rest-api/Manga/mangadex/random

API

Manga

Mangadex

Random Manga

# Random Manga

Technical details regarding the usage of the random manga function for the mangadex provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangadex/random
```

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/manga/mangadex/random";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "altTitles": ["string"], // or null
  "genres": ["string"], // or null
  "headerForImage": { "Referer": "string" }, // or null
  "image": "string", // or null
  "description": "string" // or null
}
```

[Get Manga Chapter Pages](/rest-api/Manga/mangadex/get-manga-chapter-pages "Get Manga Chapter Pages")[Recently Added](/rest-api/Manga/mangadex/recent "Recently Added")
---

# Recently Added Manga

**Source:** https://docs.consumet.org/rest-api/Manga/mangadex/recent

API

Manga

Mangadex

Recently Added

# Recently Added Manga

Technical details regarding the usage of the recently added manga function for the mangadex provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangadex/recent?page={page}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | number | The page number of results to return. | No | 1 |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example page of 1.
const url = "https://api.consumet.org/manga/mangadex/recent";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "altTitles": ["string"],
      "headerForImage": { "Referer": "string" },
      "image": "string"
    }
  ]
}
```

[Random Manga](/rest-api/Manga/mangadex/random "Random Manga")[Latest Updates](/rest-api/Manga/mangadex/latest "Latest Updates")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Manga/mangadex/search

API

Manga

Mangadex

Search

# Search

Technical details regarding the usage of the search function for the mangadex provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangadex/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "demon".
const url = "https://api.consumet.org/manga/mangadex/demon";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 0,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "altTitles": ["string"],
      "headerForImage": { "Referer": "string" },
      "image": "string"
    }
  ]
}
```

[Read Chapter](/rest-api/Light-Novels/novelupdates/read-chapter "Read Chapter")[Get Manga Info](/rest-api/Manga/mangadex/get-manga-info "Get Manga Info")
---

# Get Manga Chapter Pages

**Source:** https://docs.consumet.org/rest-api/Manga/mangahere/get-manga-chapter-pages

API

Manga

Mangahere

Get Manga Chapter Pages

# Get Manga Chapter Pages

Technical details regarding the usage of the get manga chapter pages function for the mangahere provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangahere/read?chapterId={chapterId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| chapterId | string | The mangahere ID of the chapter; i.e. provided by searching for said anime and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example chapter ID of "yofukashi_no_uta/c154"
const url = "https://api.consumet.org/manga/mangahere/read";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { chapterId: "yofukashi_no_uta/c154"} });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "page": number,
    "img": "string",
    "headerForImage": "string"
  },
  ...
]
```

[Get Manga Info](/rest-api/Manga/mangahere/get-manga-info "Get Manga Info")[Rankings](/rest-api/Manga/mangahere/rankings "Rankings")
---

# Get Manga Info

**Source:** https://docs.consumet.org/rest-api/Manga/mangahere/get-manga-info

API

Manga

Mangahere

Get Manga Info

# Get Manga Info

Technical details regarding the usage of the get manga info function for the mangahere provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangahere/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The mangahere ID of the manga; i.e. provided by searching for said manga and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example ID of "yofukashi_no_uta".
const url = "https://api.consumet.org/manga/mangahere/info";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { id: "yofukashi_no_uta"} });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "altTitles": ["string"], // or null
  "genres": ["string"], // or null
  "headerForImage": "string", // or null
  "image": "string", // or null
  "chapters": [
    {
      "id": "string",
      "title": "string",
      "releaseDate": "string" // or null
    }
  ]
}
```

[Search](/rest-api/Manga/mangahere/search "Search")[Get Manga Chapter Pages](/rest-api/Manga/mangahere/get-manga-chapter-pages "Get Manga Chapter Pages")
---

# Get Hot Releases

**Source:** https://docs.consumet.org/rest-api/Manga/mangahere/hot-releases

API

Manga

Mangahere

Hot Releases

# Get Hot Releases

Technical details regarding the usage of the get hot releases function for the mangahere provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangahere/hot
```

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/manga/mangahere/hot";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "headerForImage": { "Referer": "string" },
      "image": "string"
    }
  ]
}
```

[Rankings](/rest-api/Manga/mangahere/rankings "Rankings")[Trending](/rest-api/Manga/mangahere/trending "Trending")
---

# Image Proxy

**Source:** https://docs.consumet.org/rest-api/Manga/mangahere/proxy

API

Manga

Mangahere

Image Proxy

# Image Proxy

Technical details regarding the usage of the image proxy function for the mangahere provider can be found below. This endpoint is used to proxy manga images to bypass CORS restrictions and referrer checks. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangahere/proxy?url={url}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| url | string | The URL of the image to proxy (URL encoded). | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using an example image URL (URL encoded).
const imageUrl = encodeURIComponent("https://zjcdn.mangahere.org/store/manga/12345/001.jpg");
const url = `https://api.consumet.org/manga/mangahere/proxy?url=${imageUrl}`;
 
const data = async () => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return response.data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `image/*`

Returns the proxied image binary data with the appropriate content type.

[Recent Updates](/rest-api/Manga/mangahere/recent-updates "Recent Updates")[Search](/rest-api/Manga/mangapill/search "Search")
---

# Get Manga Rankings

**Source:** https://docs.consumet.org/rest-api/Manga/mangahere/rankings

API

Manga

Mangahere

Rankings

# Get Manga Rankings

Technical details regarding the usage of the get manga rankings function for the mangahere provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangahere/rankings?type={type}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| type | string | The ranking type. Can be: `total`, `month`, `week`, `day`. | No | `total` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example type "week".
const url = "https://api.consumet.org/manga/mangahere/rankings?type=week";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "headerForImage": { "Referer": "string" },
      "image": "string"
    }
  ]
}
```

[Get Manga Chapter Pages](/rest-api/Manga/mangahere/get-manga-chapter-pages "Get Manga Chapter Pages")[Hot Releases](/rest-api/Manga/mangahere/hot-releases "Hot Releases")
---

# Get Recent Updates

**Source:** https://docs.consumet.org/rest-api/Manga/mangahere/recent-updates

API

Manga

Mangahere

Recent Updates

# Get Recent Updates

Technical details regarding the usage of the get recent updates function for the mangahere provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangahere/recent?page={page}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | number | The page number for pagination. | No | 1 |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example page 2.
const url = "https://api.consumet.org/manga/mangahere/recent?page=2";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 0,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "headerForImage": { "Referer": "string" },
      "image": "string",
      "chapter": "string",
      "updatedAt": "string"
    }
  ]
}
```

[Trending](/rest-api/Manga/mangahere/trending "Trending")[Image Proxy](/rest-api/Manga/mangahere/proxy "Image Proxy")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Manga/mangahere/search

API

Manga

Mangahere

Search

# Search

Technical details regarding the usage of the search function for the mangahere provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangahere/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "demon".
const url = "https://api.consumet.org/manga/mangahere/demon";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 0,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "altTitles": ["string"],
      "headerForImage": { "Referer": "string" },
      "image": "string"
    }
  ]
}
```

[Image Proxy](/rest-api/Manga/mangadex/proxy "Image Proxy")[Get Manga Info](/rest-api/Manga/mangahere/get-manga-info "Get Manga Info")
---

# Get Trending Manga

**Source:** https://docs.consumet.org/rest-api/Manga/mangahere/trending

API

Manga

Mangahere

Trending

# Get Trending Manga

Technical details regarding the usage of the get trending manga function for the mangahere provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangahere/trending
```

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/manga/mangahere/trending";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "headerForImage": { "Referer": "string" },
      "image": "string"
    }
  ]
}
```

[Hot Releases](/rest-api/Manga/mangahere/hot-releases "Hot Releases")[Recent Updates](/rest-api/Manga/mangahere/recent-updates "Recent Updates")
---

# Browse by Genre

**Source:** https://docs.consumet.org/rest-api/Manga/mangakakalot/by-genre

API

Manga

Mangakakalot

Browse by Genre

# Browse by Genre

Get manga filtered by genre from Mangakakalot.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangakakalot/bygenre?genre={genre}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| genre | string | Genre slug (e.g., action, romance, comedy, fantasy, horror) | Yes |  |
| page | number | Page number for pagination | No | 1 |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/manga/mangakakalot/bygenre";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { genre: "action", page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "description": "string"
    }
  ]
}
```

[Latest Updates](/rest-api/Manga/mangakakalot/latest-updates "Latest Updates")[Search Suggestions](/rest-api/Manga/mangakakalot/suggestions "Search Suggestions")
---

# Get Manga Chapter Pages

**Source:** https://docs.consumet.org/rest-api/Manga/mangakakalot/get-manga-chapter-pages

API

Manga

Mangakakalot

Get Manga Chapter Pages

# Get Manga Chapter Pages

Technical details regarding the usage of the get manga chapter pages function for the mangakakalot provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangakakalot/read?chapterId={chapterId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| chapterId | string | The chapter ID in format "mangaId/chapterId" from the manga info endpoint. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example chapter ID.
const url = "https://api.consumet.org/manga/mangakakalot/read";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { chapterId: "naruto/chapter-700-5" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "page": 1,
    "img": "string"
  }
]
```

[Get Manga Info](/rest-api/Manga/mangakakalot/get-manga-info "Get Manga Info")[Latest Updates](/rest-api/Manga/mangakakalot/latest-updates "Latest Updates")
---

# Get Manga Info

**Source:** https://docs.consumet.org/rest-api/Manga/mangakakalot/get-manga-info

API

Manga

Mangakakalot

Get Manga Info

# Get Manga Info

Technical details regarding the usage of the get manga info function for the mangakakalot provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangakakalot/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The mangakakalot ID of the manga; i.e. provided by searching for said manga and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example ID of "read-naruto-manga".
const url = "https://api.consumet.org/manga/mangakakalot/info";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { id: "read-naruto-manga" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "altTitles": ["string"],
  "description": "string",
  "genres": ["string"],
  "status": "string",
  "image": "string",
  "authors": ["string"],
  "chapters": [
    {
      "id": "string",
      "title": "string",
      "releasedDate": "string"
    }
  ]
}
```

[Search](/rest-api/Manga/mangakakalot/search "Search")[Get Manga Chapter Pages](/rest-api/Manga/mangakakalot/get-manga-chapter-pages "Get Manga Chapter Pages")
---

# Latest Updates

**Source:** https://docs.consumet.org/rest-api/Manga/mangakakalot/latest-updates

API

Manga

Mangakakalot

Latest Updates

# Latest Updates

Get the latest manga updates from Mangakakalot.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangakakalot/latestmanga
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | number | Page number for pagination | No | 1 |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/manga/mangakakalot/latestmanga";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "chapter": "string",
      "updatedAt": "string"
    }
  ]
}
```

[Get Manga Chapter Pages](/rest-api/Manga/mangakakalot/get-manga-chapter-pages "Get Manga Chapter Pages")[Browse by Genre](/rest-api/Manga/mangakakalot/by-genre "Browse by Genre")
---

# Image Proxy

**Source:** https://docs.consumet.org/rest-api/Manga/mangakakalot/proxy

API

Manga

Mangakakalot

Image Proxy

# Image Proxy

Proxy manga images to bypass CORS and hotlink protection. Use this endpoint to display manga images in your application.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangakakalot/proxy?url={imageUrl}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| url | string | The image URL to proxy | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
const imageUrl = "https://example.com/manga-image.jpg";
const proxyUrl = `https://api.consumet.org/manga/mangakakalot/proxy?url=${encodeURIComponent(imageUrl)}`;
 
// Use in img tag or fetch as blob
const img = document.createElement('img');
img.src = proxyUrl;
```

## Response Schema

**MIME Type:** `image/jpeg` or `image/png` or `image/webp`

Returns the binary image data with appropriate content-type header.

**Headers:**

* `Content-Type`: The MIME type of the image
* `Cache-Control`: `public, max-age=86400`
* `Access-Control-Allow-Origin`: `*`

[Search Suggestions](/rest-api/Manga/mangakakalot/suggestions "Search Suggestions")[Search](/rest-api/Manga/comick/search "Search")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Manga/mangakakalot/search

API

Manga

Mangakakalot

Search

# Search

Technical details regarding the usage of the search function for the mangakakalot provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangakakalot/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the manga you are looking for. | Yes |  |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | number | Page number for pagination | No | 1 |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "naruto".
const url = "https://api.consumet.org/manga/mangakakalot/naruto";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "description": "string",
      "status": "string",
      "latestChapter": "string"
    }
  ]
}
```

[Image Proxy](/rest-api/Manga/mangareader/proxy "Image Proxy")[Get Manga Info](/rest-api/Manga/mangakakalot/get-manga-info "Get Manga Info")
---

# Search Suggestions

**Source:** https://docs.consumet.org/rest-api/Manga/mangakakalot/suggestions

API

Manga

Mangakakalot

Search Suggestions

# Search Suggestions

Get autocomplete suggestions for search dropdown while typing.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangakakalot/suggestions?query={query}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search term for autocomplete suggestions | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/manga/mangakakalot/suggestions";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { query: "one piece" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "id": "string",
    "title": "string",
    "image": "string"
  }
]
```

[Browse by Genre](/rest-api/Manga/mangakakalot/by-genre "Browse by Genre")[Image Proxy](/rest-api/Manga/mangakakalot/proxy "Image Proxy")
---

# Get Manga Chapter Pages

**Source:** https://docs.consumet.org/rest-api/Manga/mangapill/get-manga-chapter-pages

API

Manga

Mangapill

Get Manga Chapter Pages

# Get Manga Chapter Pages

Technical details regarding the usage of the get manga chapter pages function for the mangapill provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangapill/read?chapterId={chapterId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| chapterId | string | The mangapill ID of the chapter; i.e. provided by searching for said anime and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example chapter ID of "4886-10154000/yofukashi-no-uta-chapter-1"
const url = "https://api.consumet.org/manga/mangapill/read";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { chapterId: "4886-10154000/yofukashi-no-uta-chapter-1"} });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "page": number,
    "img": "string",
    "headerForImage": "string"
  },
  ...
]
```

[Get Manga Info](/rest-api/Manga/mangapill/get-manga-info "Get Manga Info")[Image Proxy](/rest-api/Manga/mangapill/proxy "Image Proxy")
---

# Get Manga Info

**Source:** https://docs.consumet.org/rest-api/Manga/mangapill/get-manga-info

API

Manga

Mangapill

Get Manga Info

# Get Manga Info

Technical details regarding the usage of the get manga info function for the mangapill provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangapill/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The mangapill ID of the manga; i.e. provided by searching for said manga and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example ID of "4886/yofukashi-no-uta".
const url = "https://api.consumet.org/manga/mangapill/info";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { id: "4886/yofukashi-no-uta"} });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "altTitles": ["string"], // or null
  "genres": ["string"], // or null
  "headerForImage": "string", // or null
  "image": "string", // or null
  "chapters": [
    {
      "id": "string",
      "title": "string",
      "releaseDate": "string" // or null
    }
  ]
}
```

[Search](/rest-api/Manga/mangapill/search "Search")[Get Manga Chapter Pages](/rest-api/Manga/mangapill/get-manga-chapter-pages "Get Manga Chapter Pages")
---

# Image Proxy

**Source:** https://docs.consumet.org/rest-api/Manga/mangapill/proxy

API

Manga

Mangapill

Image Proxy

# Image Proxy

Technical details regarding the usage of the image proxy function for the mangapill provider can be found below. This endpoint is used to proxy manga images to bypass CORS restrictions and hotlink protection. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangapill/proxy?url={url}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| url | string | The URL of the image to proxy (URL encoded). | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using an example image URL (URL encoded).
const imageUrl = encodeURIComponent("https://mangapill.com/images/manga/12345/001.jpg");
const url = `https://api.consumet.org/manga/mangapill/proxy?url=${imageUrl}`;
 
const data = async () => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return response.data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## HTML Usage

You can also use the proxy URL directly in an HTML `<img>` tag:

```javascript
<img src="https://api.consumet.org/manga/mangapill/proxy?url=https%3A%2F%2Fmangapill.com%2Fimages%2Fmanga%2F12345%2F001.jpg" alt="Manga Page" />
```

## Response Schema

**MIME Type:** `image/*`

Returns the proxied image binary data with the appropriate content type.

[Get Manga Chapter Pages](/rest-api/Manga/mangapill/get-manga-chapter-pages "Get Manga Chapter Pages")[Search](/rest-api/Manga/mangareader/search "Search")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Manga/mangapill/search

API

Manga

Mangapill

Search

# Search

Technical details regarding the usage of the search function for the mangapill provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangapill/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "demon".
const url = "https://api.consumet.org/manga/mangapill/demon";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 0,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "altTitles": ["string"],
      "headerForImage": { "Referer": "string" },
      "image": "string"
    }
  ]
}
```

[Image Proxy](/rest-api/Manga/mangahere/proxy "Image Proxy")[Get Manga Info](/rest-api/Manga/mangapill/get-manga-info "Get Manga Info")
---

# Get Manga Chapter Pages

**Source:** https://docs.consumet.org/rest-api/Manga/mangareader/get-manga-chapter-pages

API

Manga

Mangareader

Get Manga Chapter Pages

# Get Manga Chapter Pages

Technical details regarding the usage of the get manga chapter pages function for the mangareader provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangareader/read?chapterId={chapterId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| chapterId | string | The mangareader ID of the chapter; i.e. provided by searching for said anime and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example chapter ID of "call-of-the-night-2234/en/chapter-1"
const url = "https://api.consumet.org/manga/mangareader/read";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { chapterId: "call-of-the-night-2234/en/chapter-1"} });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "page": number,
    "img": "string",
    "headerForImage": "string"
  },
  ...
]
```

[Get Manga Info](/rest-api/Manga/mangareader/get-manga-info "Get Manga Info")[Image Proxy](/rest-api/Manga/mangareader/proxy "Image Proxy")
---

# Get Manga Info

**Source:** https://docs.consumet.org/rest-api/Manga/mangareader/get-manga-info

API

Manga

Mangareader

Get Manga Info

# Get Manga Info

Technical details regarding the usage of the get manga info function for the mangareader provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangareader/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The mangareader ID of the manga; i.e. provided by searching for said manga and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example ID of "call-of-the-night-2234".
const url = "https://api.consumet.org/manga/mangareader/info";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { id: "call-of-the-night-2234"} });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "altTitles": ["string"], // or null
  "genres": ["string"], // or null
  "headerForImage": "string", // or null
  "image": "string", // or null
  "chapters": [
    {
      "id": "string",
      "title": "string",
      "releaseDate": "string" // or null
    }
  ]
}
```

[Search](/rest-api/Manga/mangareader/search "Search")[Get Manga Chapter Pages](/rest-api/Manga/mangareader/get-manga-chapter-pages "Get Manga Chapter Pages")
---

# Image Proxy

**Source:** https://docs.consumet.org/rest-api/Manga/mangareader/proxy

API

Manga

Mangareader

Image Proxy

# Image Proxy

Technical details regarding the usage of the image proxy function for the mangareader provider can be found below. This endpoint is used to proxy manga images to bypass CORS restrictions and hotlink protection. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangareader/proxy?url={url}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| url | string | The URL of the image to proxy (URL encoded). | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using an example image URL (URL encoded).
const imageUrl = encodeURIComponent("https://mangareader.to/images/manga/12345/001.jpg");
const url = `https://api.consumet.org/manga/mangareader/proxy?url=${imageUrl}`;
 
const data = async () => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return response.data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## HTML Usage

You can also use the proxy URL directly in an HTML `<img>` tag:

```javascript
<img src="https://api.consumet.org/manga/mangareader/proxy?url=https%3A%2F%2Fmangareader.to%2Fimages%2Fmanga%2F12345%2F001.jpg" alt="Manga Page" />
```

## Response Schema

**MIME Type:** `image/*`

Returns the proxied image binary data with the appropriate content type.

[Get Manga Chapter Pages](/rest-api/Manga/mangareader/get-manga-chapter-pages "Get Manga Chapter Pages")[Search](/rest-api/Manga/mangakakalot/search "Search")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Manga/mangareader/search

API

Manga

Mangareader

Search

# Search

Technical details regarding the usage of the search function for the mangareader provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/mangareader/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "demon".
const url = "https://api.consumet.org/manga/mangareader/demon";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 0,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "altTitles": ["string"],
      "headerForImage": { "Referer": "string" },
      "image": "string"
    }
  ]
}
```

[Image Proxy](/rest-api/Manga/mangapill/proxy "Image Proxy")[Get Manga Info](/rest-api/Manga/mangareader/get-manga-info "Get Manga Info")
---

# Get Manga Chapter Pages

**Source:** https://docs.consumet.org/rest-api/Manga/weebcentral/get-manga-chapter-pages

API

Manga

WeebCentral

Get Manga Chapter Pages

# Get Manga Chapter Pages

Technical details regarding the usage of the get manga chapter pages function for the weebcentral provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/weebcentral/read?chapterId={chapterId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| chapterId | string | The weebcentral ID of the chapter; i.e. provided by fetching manga info and selecting the correct chapter ID. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example chapter ID.
const url = "https://api.consumet.org/manga/weebcentral/read";
const data = async () => {
    try {
        const { data } = await axios.get(url, {
            params: {
                chapterId: "01J76XY2R7G37RRFSQJXM2YHV8/chapter-1"
            }
        });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "page": 1,
    "img": "string"
  },
  {
    "page": 2,
    "img": "string"
  }
]
```

## Note

The image URLs returned may require the use of the proxy endpoint to bypass CORS and hotlink protection. See the [Image Proxy](/rest-api/Manga/weebcentral/proxy) documentation for more details.

[Get Manga Info](/rest-api/Manga/weebcentral/get-manga-info "Get Manga Info")[Image Proxy](/rest-api/Manga/weebcentral/proxy "Image Proxy")
---

# Get Manga Info

**Source:** https://docs.consumet.org/rest-api/Manga/weebcentral/get-manga-info

API

Manga

WeebCentral

Get Manga Info

# Get Manga Info

Technical details regarding the usage of the get manga info function for the weebcentral provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/weebcentral/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The weebcentral ID of the manga; i.e. provided by searching for said manga and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example ID of "01J76XY2R7G37RRFSQJXM2YHV8/One-Piece".
const url = "https://api.consumet.org/manga/weebcentral/info";
const data = async () => {
    try {
        const { data } = await axios.get(url, {
            params: {
                id: "01J76XY2R7G37RRFSQJXM2YHV8/One-Piece"
            }
        });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "altTitles": ["string"],
  "description": "string",
  "genres": ["string"],
  "status": "string",
  "image": "string",
  "authors": ["string"],
  "chapters": [
    {
      "id": "string",
      "title": "string",
      "chapterNumber": "string",
      "releasedDate": "string"
    }
  ]
}
```

[Search](/rest-api/Manga/weebcentral/search "Search")[Get Manga Chapter Pages](/rest-api/Manga/weebcentral/get-manga-chapter-pages "Get Manga Chapter Pages")
---

# Image Proxy

**Source:** https://docs.consumet.org/rest-api/Manga/weebcentral/proxy

API

Manga

WeebCentral

Image Proxy

# Image Proxy

Technical details regarding the usage of the image proxy function for the weebcentral provider can be found below. This endpoint is used to bypass CORS and hotlink protection when loading manga images. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/weebcentral/proxy?url={url}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| url | string | The image URL to proxy (URL encoded if needed) | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using an example image URL from chapter pages.
const imageUrl = "https://example.weebcentral.com/images/chapter1/page1.jpg";
const proxyUrl = `https://api.consumet.org/manga/weebcentral/proxy?url=${encodeURIComponent(imageUrl)}`;
 
// For displaying in HTML
const img = document.createElement('img');
img.src = proxyUrl;
document.body.appendChild(img);
 
// Or fetching as blob
const fetchImage = async () => {
    try {
        const response = await axios.get(proxyUrl, {
            responseType: 'blob'
        });
        return response.data;
    } catch (err) {
        throw new Error(err.message);
    }
};
```

## Usage with Chapter Pages

```javascript
import axios from "axios";
 
// First, get chapter pages
const chapterUrl = "https://api.consumet.org/manga/weebcentral/read";
const getChapterPages = async () => {
    try {
        const { data } = await axios.get(chapterUrl, {
            params: { chapterId: "01J76XY2R7G37RRFSQJXM2YHV8/chapter-1" }
        });
        
        // Convert image URLs to use proxy
        const proxyBaseUrl = "https://api.consumet.org/manga/weebcentral/proxy?url=";
        const pagesWithProxy = data.map(page => ({
            ...page,
            img: proxyBaseUrl + encodeURIComponent(page.img)
        }));
        
        return pagesWithProxy;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(await getChapterPages());
```

## Response Schema

**MIME Type:** `image/*` (e.g., `image/jpeg`, `image/png`, `image/webp`)

Returns the raw image binary data with appropriate headers:

* `Content-Type`: The original image content type
* `Cache-Control`: `public, max-age=86400`
* `Access-Control-Allow-Origin`: `*`

## Why Use This Proxy?

Many manga websites implement hotlink protection and CORS policies that prevent images from being loaded directly in web applications. This proxy endpoint:

1. **Bypasses CORS**: Adds appropriate CORS headers to allow cross-origin requests
2. **Bypasses Hotlink Protection**: Sets the proper `Referer` header expected by the source
3. **Caching**: Implements caching headers for better performance
4. **User-Agent Spoofing**: Uses a standard browser User-Agent to avoid blocks

[Get Manga Chapter Pages](/rest-api/Manga/weebcentral/get-manga-chapter-pages "Get Manga Chapter Pages")[Search](/rest-api/Movies/dramacool/search "Search")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Manga/weebcentral/search

API

Manga

WeebCentral

Search

# Search

Technical details regarding the usage of the search function for the weebcentral provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/manga/weebcentral/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes |  |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | number | The page number of search results | No | 1 |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "one piece".
const url = "https://api.consumet.org/manga/weebcentral/one piece";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

### With Page Parameter

```javascript
import axios from "axios";
 
// Using the example query "one piece" with page 2.
const url = "https://api.consumet.org/manga/weebcentral/one piece?page=2";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "image": "string"
    }
  ]
}
```

[Image Proxy](/rest-api/Manga/asurascans/proxy "Image Proxy")[Get Manga Info](/rest-api/Manga/weebcentral/get-manga-info "Get Manga Info")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-anime/advanced-search

API

Meta

Anilist (Anime)

Advanced Search

# Search

Technical details regarding the usage of the search function for the anilist provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/anilist/advanced-search
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | No | `""` |
| type | string | The type of entertainment. Enum: `"ANIME"` `"MANGA"` | No | `"ANIME"` |
| page | integer | The page number of results to return. | No | `1` |
| perPage | integer | The number of items perpage of results to return. | No | `20` |
| season | string | The season the anime aired in. Enum: `"WINTER"` `"SPRING"` `"SUMMER"` `"FALL"` | No | `""` |
| format | string | The fromat of the anime. Enum: `"TV"` `"TV_SHORT"` `"OVA"` `"ONA"` `"MOVIE"` `"SPECIAL"` `"MUSIC"` | No | `""` |
| sort | array | the items you want to sort by. Array Enum: `"POPULARITY_DESC"` `"POPULARITY"` `"TRENDING_DESC"` `"TRENDING"` `"UPDATED_AT_DESC"` `"UPDATED_AT"` `"START_DATE_DESC"` `"START_DATE"` `"END_DATE_DESC"` `"END_DATE"` `"FAVOURITES_DESC"` `"FAVOURITES"` `"SCORE_DESC"` `"SCORE"` `"TITLE_ROMAJI_DESC"` `"TITLE_ROMAJI"` `"TITLE_ENGLISH_DESC"` `"TITLE_ENGLISH"` `"TITLE_NATIVE_DESC"` `"TITLE_NATIVE"` `"EPISODES_DESC"` `"EPISODES"` `"ID"` `"ID_DESC"` | No | `["POPULARITY_DESC","SCORE_DESC"]` |
| genres | array | The genres you want to search for. Array Enum: `"Action"` `"Adventure"` `"Cars"` `"Comedy"` `"Drama"` `"Fantasy"` `"Horror"` `"Mahou Shoujo"` `"Mecha"` `"Music"` `"Mystery"` `"Psychological"` `"Romance"` `"Sci-Fi"` `"Slice of Life"` `"Sports"` `"Supernatural"` `"Thriller"` | No | `""` |
| id | string | The id of the anime you are looking for | No | `""` |
| year | string | The year the anime released in | No | `""` |
| status | string | The current status of the anime you are looking for Enum: `"RELEASING"` `"NOT_YET_RELEASED"` `"FINISHED"` `"CANCELLED"` `"HIATUS"` | No | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "demon", and looking at the first page of results.
const url = "https://api.consumet.org/meta/anilist/advanced-search";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
"currentPage": 1,
"results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "type": "string",
      "rating": "number",
      "releaseDate": "string"
    }
  ]
}
```

[Search](/rest-api/Meta/anilist-anime/search "Search")[Get Anime Info](/rest-api/Meta/anilist-anime/get-anime-info "Get Anime Info")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-anime/get-airing-schedule

API

Meta

Anilist (Anime)

Get Airing Schedule

# Search

Technical details regarding the usage of the search function for the anilist provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/anilist/airing-schedule
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |
| perPage | integer | The number of results per page to return. | No | `20` |
| weekStart | string | Filter by the start of the week. you can use either the number or the string | No | `today's date` |
| weekEnd | string | Filter by the end of the week. you can use either the number or the string. Enum/or Integer: `"Saturday or 0"` `"Sunday or 1"` `"Monday or 2"` `"Tuesday or 3"` `"Wednesday or 4"` `"Thursday or 5"` `"Friday or 6"` | No | `today's date + 7 days` |
| notYetAired | bool | The season the anime aired in. Bool: `true` `false` | No | `false` |

est Samples

```javascript
import axios from "axios";
 
// Using the example query "demon", and looking at the first page of results.
const url = "https://api.consumet.org/meta/anilist/airing-schedule";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
"currentPage": 1,
"results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "type": "string",
      "rating": "number",
      "releaseDate": "string"
    }
  ]
}
```

[Get Popular Anime](/rest-api/Meta/anilist-anime/get-popular-anime "Get Popular Anime")[Get Random Anime](/rest-api/Meta/anilist-anime/get-random-anime "Get Random Anime")
---

# Get Anilist Data

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-anime/get-anilist-data

API

Meta

Anilist (Anime)

Get Anilist Data

# Get Anilist Data

Technical details regarding the usage of the get anilist data function for the Anilist Anime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/anilist/data/{id}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The anilist info id | Yes | `N/A` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example id of "21" (one piece)
const url = "https://api.consumet.org/meta/anilist/data/21";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
    "id": "string",
    "title": "string[]",
    "malId": "integer",
    "trailer": {
      "id": "string",
      "site": "string",
      "thumbnail": "string"
    },
    "image": "string",
    "popularity": "number",
    "color": "string",
    "description": "string",
    "status": "string",
    "releaseDate": "integer",
    "startDate": {
      "year": "number",
      "month": "number",
      "day": "number"
    },
    "endDate": {
      "year": "number",
      "month": "number",
      "day": "number"
    },
    "rating": "integer",
    "genres": "string[]",
    "season": "string",
    "studios": "string[]",
    "type": "string",
    "recommendations": {
      "id": "string",
      "malId": "string",
      "title": "string[]",
      "status": "string",
      "episodes": "number",
      "image": "string",
      "cover": "string",
      "rating": "number",
      "type": "string"
    },
    "characters": {
      "id": "string",
      "role": "string",
      "name": "string[]",
      "image": "string"
    },
    "relations": {
      "id": "integer",
      "relationType": "string",
      "malId": "integer",
      "title": "string[]",
      "status": "string",
      "episodes": "integer",
      "image": "string",
      "color": "string",
      "type": "string",
      "cover": "string",
      "rating": "integer"
    }
}
```

[Get Random Anime](/rest-api/Meta/anilist-anime/get-random-anime "Get Random Anime")[Get Episodes](/rest-api/Meta/anilist-anime/get-episodes "Get Episodes")
---

# Get Anime By Genres

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-anime/get-anime-by-genres

API

Meta

Anilist (Anime)

Get Anime By Genres

# Get Anime By Genres

[Get Recent Anime Episodes](/rest-api/Meta/anilist-anime/get-recent-anime-episodes "Get Recent Anime Episodes")[Get Trending Anime](/rest-api/Meta/anilist-anime/get-trending-anime "Get Trending Anime")
---

# Get Anime Episode Streaming Links

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-anime/get-anime-episode-streaming-links

API

Meta

Anilist (Anime)

Get Anime Episode Streaming Links

# Get Anime Episode Streaming Links

Technical details regarding the usage of the get anime streaming links function for the anilist meta provider can be found below.
Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/anilist/watch/{episodeId}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The ID of the selected episode | Yes | N/A |

## Request Samples

```javascript
import axios from "axios";
 
/*
Using the example episode ID of  'spy-x-family-episode-1',
*/
const url = "https://api.consumet.org/meta/anilist/watch/spy-x-family-episode-1";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
    "id": "string",
    "title": "string[]",
    "malId": "integer",
    "trailer": {
      "id": "string",
      "site": "string",
      "thumbnail": "string"
    },
    "image": "string",
    "popularity": "number",
    "color": "string",
    "description": "string",
    "status": "string",
    "releaseDate": "integer",
    "startDate": {
      "year": "number",
      "month": "number",
      "day": "number"
    },
    "endDate": {
       "year": "number",
       "month": "number",
       "day": "number"
      },
    "rating": "integer",
    "genres": "string[]",
    "season": "string",
    "studios": "string[]",
    "type": "string",
    "recommendations": {
      "id": "string",
      "malId": "string",
      "title": "string[]",
      "status": "string",
      "episodes": "number",
      "image": "string",
      "cover": "string",
      "rating": "number",
      "type": "string",
    },
    "characters": {
      "id": "string",
      "role": "string",
      "name": "string[]",
      "image": "string",
    },
    "relations": {
      "id": "integer",
      "relationType": "string",
      "malId": "integer",
      "title": "string[]",
      "status": "string",
      "episodes": "integer",
      "image": "string",
      "color": "string",
      "type": "string",
      "cover": "string",
      "rating": "integer",
    },
    "episodes": {
      "id": "string",
      "title": "string",
      "chapter": "string",
    }
}
```

[Get Anime Info](/rest-api/Meta/anilist-anime/get-anime-info "Get Anime Info")[Get Recent Anime Episodes](/rest-api/Meta/anilist-anime/get-recent-anime-episodes "Get Recent Anime Episodes")
---

# Info

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-anime/get-anime-info

API

Meta

Anilist (Anime)

Get Anime Info

# Info

Technical details regarding the usage of the get anime info function for the Anilist Anime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/anilist/info/{id}?provider={provider}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The anilist info id | Yes | `N/A` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| provider | string | The provider you want to use. Enum: `9anime`, `animefox`, `animepahe`, `bilibili`, `crunchyroll`, `enime`, `gogoanime`, `marin`, `zoro` | No | `N/A` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example id of "21" (one piece) and the query of "gogoanime"
const url = "https://api.consumet.org/meta/anilist/info/21";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { provider: "gogoanime" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
    "id": "string",
    "title": "string[]",
    "malId": "integer",
    "trailer": {
      "id": "string",
      "site": "string",
      "thumbnail": "string"
    },
    "image": "string",
    "popularity": "number",
    "color": "string",
    "description": "string",
    "status": "string",
    "releaseDate": "integer",
    "startDate": {
      "year": "number",
      "month": "number",
      "day": "number"
    },
    "endDate": {
      "year": "number",
      "month": "number",
      "day": "number"
      },
    "rating": "integer",
    "genres": "string[]",
    "season": "string",
    "studios": "string[]",
    "type": "string",
    "recommendations": {
      "id": "string",
      "malId": "string",
      "title": "string[]",
      "status": "string",
      "episodes": "number",
      "image": "string",
      "cover": "string",
      "rating": "number",
      "type": "string",
    },
    "characters": {
      "id": "string",
      "role": "string",
      "name": "string[]",
      "image": "string",
    },
    "relations": {
      "id": "integer",
      "relationType": "string",
      "malId": "integer",
      "title": "string[]",
      "status": "string",
      "episodes": "integer",
      "image": "string",
      "color": "string",
      "type": "string",
      "cover": "string",
      "rating": "integer",
    },
    "episodes": {
      "id": "string",
      "title": "string",
      "episode": "string",
    }
}
```

[Advanced Search](/rest-api/Meta/anilist-anime/advanced-search "Advanced Search")[Get Anime Episode Streaming Links](/rest-api/Meta/anilist-anime/get-anime-episode-streaming-links "Get Anime Episode Streaming Links")
---

# Get Character Info

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-anime/get-character-info

API

Meta

Anilist (Anime)

Get Character Info

# Get Character Info

Technical details regarding the usage of the get character info function for the Anilist Anime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/anilist/character/{id}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The anilist character id | Yes | `N/A` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example character id of "5"
const url = "https://api.consumet.org/meta/anilist/character/5";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
    "id": "string",
    "name": {
      "first": "string",
      "last": "string",
      "full": "string",
      "native": "string",
      "userPreferred": "string"
    },
    "image": "string",
    "description": "string",
    "gender": "string",
    "dateOfBirth": {
      "year": "number",
      "month": "number",
      "day": "number"
    },
    "bloodType": "string",
    "appearances": "string[]",
    "relations": {
      "id": "string",
      "role": "string",
      "name": "string",
      "image": "string"
    }
}
```

[Get Episode Servers](/rest-api/Meta/anilist-anime/get-episode-servers "Get Episode Servers")[Get Staff Info](/rest-api/Meta/anilist-anime/get-staff-info "Get Staff Info")
---

# Get Episode Servers

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-anime/get-episode-servers

API

Meta

Anilist (Anime)

Get Episode Servers

# Get Episode Servers

Technical details regarding the usage of the get episode servers function for the Anilist Anime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/anilist/servers/{id}?provider={provider}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The anilist info id | Yes | `N/A` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| provider | string | The provider you want to use. Enum: `9anime`, `animefox`, `animepahe`, `bilibili`, `crunchyroll`, `enime`, `gogoanime`, `marin`, `zoro` | No | `zoro` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example id of "21" (one piece)
const url = "https://api.consumet.org/meta/anilist/servers/21";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { provider: "zoro" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "servers": [
    {
      "name": "string",
      "url": "string"
    }
  ]
}
```

[Get Episodes](/rest-api/Meta/anilist-anime/get-episodes "Get Episodes")[Get Character Info](/rest-api/Meta/anilist-anime/get-character-info "Get Character Info")
---

# Get Episodes

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-anime/get-episodes

API

Meta

Anilist (Anime)

Get Episodes

# Get Episodes

Technical details regarding the usage of the get episodes function for the Anilist Anime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/anilist/episodes/{id}?provider={provider}&dub={dub}&fetchFiller={fetchFiller}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The anilist info id | Yes | `N/A` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| provider | string | The provider you want to use. Enum: `9anime`, `animefox`, `animepahe`, `bilibili`, `crunchyroll`, `enime`, `gogoanime`, `marin`, `zoro` | No | `zoro` |
| dub | boolean | Whether to fetch the dub version or sub version | No | `false` |
| fetchFiller | boolean | Whether to fetch filler information or not | No | `false` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example id of "21" (one piece)
const url = "https://api.consumet.org/meta/anilist/episodes/21";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { provider: "zoro", dub: false, fetchFiller: true } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "totalEpisodes": "number",
  "episodes": [
    {
      "id": "string",
      "number": "number",
      "title": "string",
      "description": "string",
      "url": "string",
      "image": "string",
      "airDate": "string",
      "isFiller": "boolean"
    }
  ]
}
```

[Get Anilist Data](/rest-api/Meta/anilist-anime/get-anilist-data "Get Anilist Data")[Get Episode Servers](/rest-api/Meta/anilist-anime/get-episode-servers "Get Episode Servers")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-anime/get-popular-anime

API

Meta

Anilist (Anime)

Get Popular Anime

# Search

Technical details regarding the usage of the search function for the anilist provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/anilist/popular?page={page}&perPage={perPage}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |
| perPage | integer | The number of results per page to return. | No | `20` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "demon", and looking at the first page of results.
const url = "https://api.consumet.org/meta/anilist/popular";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: {
           page: 1,
           perPage: 20
          } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
"currentPage": 1,
"results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "type": "string",
      "rating": "number",
      "releaseDate": "string"
    }
  ]
}
```

[Get Trending Anime](/rest-api/Meta/anilist-anime/get-trending-anime "Get Trending Anime")[Get Airing Schedule](/rest-api/Meta/anilist-anime/get-airing-schedule "Get Airing Schedule")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-anime/get-random-anime

API

Meta

Anilist (Anime)

Get Random Anime

# Search

Technical details regarding the usage of the search function for the anilist provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/anilist/random-anime
```

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "demon", and looking at the first page of results.
const url = "https://api.consumet.org/meta/anilist/random-anime";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
    "id": "string",
    "title": "string[]",
    "malId": "integer",
    "trailer": {
      "id": "string",
      "site": "string",
      "thumbnail": "string"
    },
    "image": "string",
    "popularity": "number",
    "color": "string",
    "description": "string",
    "status": "string",
    "releaseDate": "integer",
    "startDate": {
      "year": "number",
      "month": "number",
      "day": "number"
    },
    "endDate": {
       "year": "number",
       "month": "number",
       "day": "number"
      },
    "rating": "integer",
    "genres": "string[]",
    "season": "string",
    "studios": "string[]",
    "type": "string",
    "recommendations": {
      "id": "string",
      "malId": "string",
      "title": "string[]",
      "status": "string",
      "episodes": "number",
      "image": "string",
      "cover": "string",
      "rating": "number",
      "type": "string",
    },
    "characters": {
      "id": "string",
      "role": "string",
      "name": "string[]",
      "image": "string",
    },
    "relations": {
      "id": "integer",
      "relationType": "string",
      "malId": "integer",
      "title": "string[]",
      "status": "string",
      "episodes": "integer",
      "image": "string",
      "color": "string",
      "type": "string",
      "cover": "string",
      "rating": "integer",
    },
    "episodes": {
      "id": "string",
      "title": "string",
      "chapter": "string",
    }
}
```

[Get Airing Schedule](/rest-api/Meta/anilist-anime/get-airing-schedule "Get Airing Schedule")[Get Anilist Data](/rest-api/Meta/anilist-anime/get-anilist-data "Get Anilist Data")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-anime/get-recent-anime-episodes

API

Meta

Anilist (Anime)

Get Recent Anime Episodes

# Search

Technical details regarding the usage of the search function for the anilist provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/anilist/recent-episodes?page={page}&perPage={perPage}&provider={provider}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |
| perPage | integer | The number of results per page to return. | No | `20` |
| provider | string | the provider you want to fetch the recent episodes from | No | `gogoanime` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "demon", and looking at the first page of results.
const url = "https://api.consumet.org/meta/anilist/recent-episodes";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: {
           page: 1,
           perPage: 20
           provider: "gogoanime"
          } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": "number",
  "totalResults": "number",
  "results": [
    {
      "id": "string",
      "malId": "string",
      "title": {
        "romaji": "string",
        "english": "string",
        "native": "string"
      },
      "image": "string",
      "imageHash": "string",
      "episodeId": "string",
      "episodeTitle": "string",
      "episodeNumber": "number",
      "type": "string"
    }
  ]
}
```

[Get Anime Episode Streaming Links](/rest-api/Meta/anilist-anime/get-anime-episode-streaming-links "Get Anime Episode Streaming Links")[Get Anime By Genres](/rest-api/Meta/anilist-anime/get-anime-by-genres "Get Anime By Genres")
---

# Get Staff Info

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-anime/get-staff-info

API

Meta

Anilist (Anime)

Get Staff Info

# Get Staff Info

Technical details regarding the usage of the get staff info function for the Anilist Anime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/anilist/staff/{id}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The ID of the staff member | Yes | N/A |

## Request Samples

```javascript
import axios from "axios";
 
/*
Using the example staff ID of '95095' (Junichi Suwabe),
*/
const url = "https://api.consumet.org/meta/anilist/staff/95095";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
    "id": "string",
    "name": {
      "first": "string",
      "last": "string",
      "full": "string",
      "native": "string",
      "alternative": "string[]"
    },
    "image": "string",
    "description": "string",
    "primaryOccupations": "string[]",
    "gender": "string",
    "dateOfBirth": {
      "year": "number",
      "month": "number",
      "day": "number"
    },
    "dateOfDeath": {
      "year": "number",
      "month": "number",
      "day": "number"
    },
    "age": "number",
    "yearsActive": "number[]",
    "homeTown": "string",
    "bloodType": "string",
    "isFavourite": "boolean",
    "characters": {
      "id": "string",
      "role": "string",
      "name": "string[]",
      "image": "string"
    },
    "staff": {
      "id": "string",
      "role": "string",
      "name": "string[]",
      "image": "string"
    }
}
```

[Get Character Info](/rest-api/Meta/anilist-anime/get-character-info "Get Character Info")[Search](/rest-api/Meta/anilist-manga/Search "Search")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-anime/get-trending-anime

API

Meta

Anilist (Anime)

Get Trending Anime

# Search

Technical details regarding the usage of the search function for the anilist provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/anilist/trending?page={page}&perPage={perPage}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |
| perPage | integer | The numb of results per page to return. | No | `20` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "demon", and looking at the first page of results.
const url = "https://api.consumet.org/meta/anilist/trending";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: {
           page: 1,
           perPage: 20
          } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
"currentPage": 1,
"results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "type": "string",
      "rating": "number",
      "releaseDate": "string"
    }
  ]
}
```

[Get Anime By Genres](/rest-api/Meta/anilist-anime/get-anime-by-genres "Get Anime By Genres")[Get Popular Anime](/rest-api/Meta/anilist-anime/get-popular-anime "Get Popular Anime")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-anime/search

API

Meta

Anilist (Anime)

Search

# Search

Technical details regarding the usage of the search function for the anilist provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/anilist/{query}?page={page}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes | `""` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "demon", and looking at the first page of results.
const url = "https://api.consumet.org/meta/anilist/demon";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
"currentPage": 1,
"results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "type": "string",
      "rating": "number",
      "releaseDate": "string"
    }
  ]
}
```

[Get Comic Info](/rest-api/Comics/getcomics/get-comic-info "Get Comic Info")[Advanced Search](/rest-api/Meta/anilist-anime/advanced-search "Advanced Search")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-manga/Search

API

Meta

Anilist (Manga)

Search

# Search

Technical details regarding the usage of the search function for the Anilist Manga provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/anilist-manga/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "one piece"
const url = "https://api.consumet.org/meta/anilist-manga/one piece";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
"currentPage": 1,
"results": [
    {
      "id": "string",
      "malId": "integer",
      "title": {
        "romaji": "string",
        "english": "string",
        "native": "string"
      }, 
      "status": "string",
      "image": "string",
      "cover": "string",
      "popularity": "integer",
      "description": "string",
      "rating": "integer",
      "genres": [
        "string"
      ],
      "color": "string",
      "totalChapters": "integer",
      "volumes": "integer",
      "type": "string",
      "releaseDate": "string",
    }
  ]
}
```

[Get Staff Info](/rest-api/Meta/anilist-anime/get-staff-info "Get Staff Info")[Get Manga Info](/rest-api/Meta/anilist-manga/info "Get Manga Info")
---

# Info

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-manga/info

API

Meta

Anilist (Manga)

Get Manga Info

# Info

Technical details regarding the usage of the get manga info function for the Anilist Manga provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/anilist-manga/info/{id}?provider={provider}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The manga id | Yes | `N/A` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| provider | string | The provider you want to use. Enum: `mangadex`, `mangahere`, `mangakakalot`, `mangapark`, `mangapill`, `mangareader`, `mangasee123` | Yes | `N/A` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example id of "30013" and the query of "mangareader"
const url = "https://api.consumet.org/meta/anilist-manga/info/30013";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { provider: "mangareader" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
    "id": "string",
    "title": "string[]",
    "malId": "integer",
    "trailer": {
      "id": "string",
      "site": "string",
      "thumbnail": "string"
    },
    "image": "string",
    "popularity": "number",
    "color": "string",
    "description": "string",
    "status": "string",
    "releaseDate": "integer",
    "startDate": {
      "year": "number",
      "month": "number",
      "day": "number"
    },
    "endDate": {
       "year": "number",
       "month": "number",
       "day": "number"
      },
    "rating": "integer",
    "genres": "string[]",
    "season": "string",
    "studios": "string[]",
    "type": "string",
    "recommendations": {
      "id": "string",
      "malId": "string",
      "title": "string[]",
      "status": "string",
      "chapters": "number",
      "image": "string",
      "cover": "string",
      "rating": "number",
      "type": "string",
    },
    "characters": {
      "id": "string",
      "role": "string",
      "name": "string[]",
      "image": "string",
    },
    "relations": {
      "id": "integer",
      "relationType": "string",
      "malId": "integer",
      "title": "string[]",
      "status": "string",
      "chapters": "integer",
      "image": "string",
      "color": "string",
      "type": "string",
      "cover": "string",
      "rating": "integer",
    },
    "chapters": {
      "id": "string",
      "title": "string",
      "chapter": "string",
    }
}
```

[Search](/rest-api/Meta/anilist-manga/Search "Search")[Read Manga](/rest-api/Meta/anilist-manga/read "Read Manga")
---

# Read

**Source:** https://docs.consumet.org/rest-api/Meta/anilist-manga/read

API

Meta

Anilist (Manga)

Read Manga

# Read

Technical details regarding the usage of the Read function for the Anilist Manga provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/anilist-manga/read?chapterId={chapterId}&provider={provider}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| chapterId | string | The ID of the selected chapter you want to read | Yes | `N/A` |
| provider | string | The provider you want to use. Enum: `mangadex`, `mangahere`, `mangakakalot`, `mangapark`, `mangapill`, `mangareader`, `mangasee123` | no | `N/A` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example id of "30013" and the query of "mangareader"
const url = "https://api.consumet.org/meta/anilist-manga/read";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { chapterId: "one-piece-3/fr/chapter-1", provider: "mangareader" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
    "img": "string",
    "page": "integer",
}
```

[Get Manga Info](/rest-api/Meta/anilist-manga/info "Get Manga Info")[Search](/rest-api/Meta/myanimelist/search "Search")
---

# Get Anime Episode Streaming Links

**Source:** https://docs.consumet.org/rest-api/Meta/myanimelist/get-anime-episode-streaming-links

API

Meta

MyAnimeList

Get Anime Episode Streaming Links

# Get Anime Episode Streaming Links

Technical details regarding the usage of the get anime streaming links function for the MyAnimeList meta provider can be found below.
Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/mal/watch/{episodeId}?provider={provider}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The ID of the selected episode | Yes | N/A |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| provider | string | The provider you want to use. Enum: `9anime`, `animefox`, `animepahe`, `bilibili`, `crunchyroll`, `enime`, `gogoanime`, `marin`, `zoro` | No | `N/A` |

## Request Samples

```javascript
import axios from "axios";
 
/*
Using the example episode ID of  'jujutsu-kaisen-episode-1',
*/
const url = "https://api.consumet.org/meta/mal/watch/jujutsu-kaisen-episode-1";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
    "sources": [
      {
        "url": "string",
        "quality": "string",
        "isM3U8": "boolean"
      }
    ],
    "download": "string"
}
```

[Get Anime Info](/rest-api/Meta/myanimelist/get-anime-info "Get Anime Info")[Search](/rest-api/Meta/the-movie-database/search "Search")
---

# Info

**Source:** https://docs.consumet.org/rest-api/Meta/myanimelist/get-anime-info

API

Meta

MyAnimeList

Get Anime Info

# Info

Technical details regarding the usage of the get anime info function for the MyAnimeList provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/mal/info/{id}?provider={provider}&dub={dub}&fetchFiller={fetchFiller}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The MyAnimeList id | Yes | `N/A` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| provider | string | The provider you want to use. Enum: `9anime`, `animefox`, `animepahe`, `bilibili`, `crunchyroll`, `enime`, `gogoanime`, `marin`, `zoro` | No | `N/A` |
| dub | boolean | Whether to fetch the dub version or sub version | No | `false` |
| fetchFiller | boolean | Whether to fetch filler information or not | No | `false` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example id of "16498" (Jujutsu Kaisen)
const url = "https://api.consumet.org/meta/mal/info/16498";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { provider: "gogoanime", dub: false } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
    "id": "string",
    "title": "string[]",
    "malId": "integer",
    "trailer": {
      "id": "string",
      "site": "string",
      "thumbnail": "string"
    },
    "image": "string",
    "popularity": "number",
    "color": "string",
    "description": "string",
    "status": "string",
    "releaseDate": "integer",
    "startDate": {
      "year": "number",
      "month": "number",
      "day": "number"
    },
    "endDate": {
      "year": "number",
      "month": "number",
      "day": "number"
    },
    "rating": "integer",
    "genres": "string[]",
    "season": "string",
    "studios": "string[]",
    "type": "string",
    "recommendations": {
      "id": "string",
      "malId": "string",
      "title": "string[]",
      "status": "string",
      "episodes": "number",
      "image": "string",
      "cover": "string",
      "rating": "number",
      "type": "string"
    },
    "characters": {
      "id": "string",
      "role": "string",
      "name": "string[]",
      "image": "string"
    },
    "relations": {
      "id": "integer",
      "relationType": "string",
      "malId": "integer",
      "title": "string[]",
      "status": "string",
      "episodes": "integer",
      "image": "string",
      "color": "string",
      "type": "string",
      "cover": "string",
      "rating": "integer"
    },
    "episodes": {
      "id": "string",
      "title": "string",
      "episode": "string"
    }
}
```

[Search](/rest-api/Meta/myanimelist/search "Search")[Get Anime Episode Streaming Links](/rest-api/Meta/myanimelist/get-anime-episode-streaming-links "Get Anime Episode Streaming Links")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Meta/myanimelist/search

API

Meta

MyAnimeList

Search

# Search

Technical details regarding the usage of the search function for the MyAnimeList provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/mal/{query}?page={page}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes | `""` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "demon", and looking at the first page of results.
const url = "https://api.consumet.org/meta/mal/demon";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
"currentPage": 1,
"results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "type": "string",
      "rating": "number",
      "releaseDate": "string"
    }
  ]
}
```

[Read Manga](/rest-api/Meta/anilist-manga/read "Read Manga")[Get Anime Info](/rest-api/Meta/myanimelist/get-anime-info "Get Anime Info")
---

# Get Anime Episode Streaming Links

**Source:** https://docs.consumet.org/rest-api/Meta/the-movie-database/get-movie-episode-streaming-links

API

Meta

The Movie Database (TMDB)

Get Movie Episode Streaming Links

# Get Anime Episode Streaming Links

Technical details regarding the usage of the get anime streaming links function for the TMDB provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/tmdb/watch/{episodeId}?id={showId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The ID of the selected episode | Yes | N/A |
| showId | string | The id of the original media ie "tv/watch-the-flash-39535" | Yes | N/A |

## Request Samples

```javascript
import axios from "axios";
 
/*
Using the example episode ID of '2922' and the example show ID of 'tv/watch-the-flash-39535',
 
*/
const url = "https://api.consumet.org/meta/tmdb/watch/2922";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { id: "tv/watch-the-flash-39535"} });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
    "headers": {
        "Referer": "string"
    },
    "sources": [
        {
        "url": "string",
        "quality": "string",
        "isM3U8": true
        }
    ],
    "subtitles": [
        {
        "url": "string",
        "lang": "string"
        }
    ]
}
```

[Get Movie Info](/rest-api/Meta/the-movie-database/get-movie-info "Get Movie Info")[Get Trending](/rest-api/Meta/the-movie-database/get-trending-movies "Get Trending")
---

# Movie Info

**Source:** https://docs.consumet.org/rest-api/Meta/the-movie-database/get-movie-info

API

Meta

The Movie Database (TMDB)

Get Movie Info

# Movie Info

Technical details regarding the usage of the get anime info function for the TMDB provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/tmdb/info/{id}?type={media-type}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The show / movie id | Yes | `N/A` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| type | string | The TMDB media type of the show / movie; i.e. provided by searching for said show and selecting the correct one. | Yes | `N/A` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example id of "60735" and the query of "tv"
const url = "https://api.consumet.org/meta/tmdb/info/60735";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { type: "tv" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
    "cover": "string",
    "recommendations": "IMovieResult[]",
    "genres": "string[]",
    "description": "string",
    "rating": "number",
    "status": "MediaStatus",
    "duration": "string",
    "production": "string",
    "casts": "string[]",
    "tags": "string[]",
    "totalEpisodes": "number",
    "seasons": "{ season: number; image?: string; episodes: IMovieEpisode[] }[]",
    "episodes": "IMovieEpisode[]",
}
```

[Search](/rest-api/Meta/the-movie-database/search "Search")[Get Movie Episode Streaming Links](/rest-api/Meta/the-movie-database/get-movie-episode-streaming-links "Get Movie Episode Streaming Links")
---

# Trending

**Source:** https://docs.consumet.org/rest-api/Meta/the-movie-database/get-trending-movies

API

Meta

The Movie Database (TMDB)

Get Trending

# Trending

Technical details regarding the usage of the trending function for the TMDB provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/tmdb/trending?type={type}&timePeriod={timePeriod}&page={page}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| type | string | The type of media to fetch (e.g., "all", "movie", "tv") | No | `all` |
| timePeriod | string | The time period for trending. Enum: `"day"` `"week"` | No | `day` |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example type of "all", and looking at the first page of results.
const url = "https://api.consumet.org/meta/tmdb/trending";
const data = async () => {
    try {
        const { data } = await axios.get(url, {
            params: {
                type: "all",
                timePeriod: "day",
                page: 1
            }
        });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
"currentPage": 1,
"results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "type": "string",
      "rating": "number",
      "releaseDate": "string"
    }
  ]
}
```

[Get Movie Episode Streaming Links](/rest-api/Meta/the-movie-database/get-movie-episode-streaming-links "Get Movie Episode Streaming Links")[Search](/rest-api/Light-Novels/read-light-novels/search "Search")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Meta/the-movie-database/search

API

Meta

The Movie Database (TMDB)

Search

# Search

Technical details regarding the usage of the search function for the TMDB provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/meta/tmdb/{query}?page={page}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes | `""` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "flash", and looking at the first page of results.
const url = "https://api.consumet.org/meta/tmdb/flash";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
"currentPage": 1,
"results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "type": "string",
      "rating": "number",
      "releaseDate": "string"
    }
  ]
}
```

[Get Anime Episode Streaming Links](/rest-api/Meta/myanimelist/get-anime-episode-streaming-links "Get Anime Episode Streaming Links")[Get Movie Info](/rest-api/Meta/the-movie-database/get-movie-info "Get Movie Info")
---

# Get Anime Episode Streaming Links

**Source:** https://docs.consumet.org/rest-api/Movies/dramacool/get-movie-episode-streaming-links

API

Movies

Dramacool

Get Movie Episode Streaming Links

# Get Anime Episode Streaming Links

Technical details regarding the usage of the get anime streaming links function for the Dramacool provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/dramacool/watch?episodeId={episodeId}&mediaId={mediaId}&server={server}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The ID of the selected episode | Yes | N/A |
| mediaId | string | The movie info ID | Yes | N/A |
| server | Enum: `"asianload"` `"mixdrop"` `"streamtape"` `"streamsb"` | The server the episode will use | No | `"asianload"` |

## Request Samples

```javascript
import axios from "axios";
 
/*
Using the example episode ID of 'vincenzo-2021-episode-1',
explicitly defining default server for demostrative purposes.
*/
const url = "https://api.consumet.org/movies/dramacool/watch";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { episodeId: "vincenzo-2021-episode-1", mediaId: "drama-detail/vincenzo", server: "asianload" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
    "headers": {
        "Referer": "string"
    },
    "sources": [
        {
        "url": "string",
        "quality": "string",
        "isM3U8": true
        }
    ],
    "subtitles": [
        {
        "url": "string",
        "lang": "string"
        }
    ]
}
```

[Get Movie Info](/rest-api/Movies/dramacool/get-movie-info "Get Movie Info")[Spotlight](/rest-api/Movies/dramacool/spotlight "Spotlight")
---

# Movie Info

**Source:** https://docs.consumet.org/rest-api/Movies/dramacool/get-movie-info

API

Movies

Dramacool

Get Movie Info

# Movie Info

Technical details regarding the usage of the get movie info function for the Dramacool provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/dramacool/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The Dramacool ID of the show / movie; i.e. provided by searching for said show and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "drama-detail/vincenzo", and looking at the 1st page of results.
const url = "https://api.consumet.org/movies/dramacool/info?id=drama-detail/vincenzo";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "url": "string",
  "image": "string",
  "releaseDate": "string",
  "description": "string",
  "geners": [
      "string"
  ],
  "type": "Movie",
  "casts": [
      "string"
  ],
  "tags": [
      "string"
  ],
  "production": "string",
  "duration": "string",
  "episodes": [
      {
      "id": "string",
      "url": "string",
      "title": "string",
      "number": 0,
      "season": 0
      }
  ]
}
```

[Search](/rest-api/Movies/dramacool/search "Search")[Get Movie Episode Streaming Links](/rest-api/Movies/dramacool/get-movie-episode-streaming-links "Get Movie Episode Streaming Links")
---

# Get Popular Drama

**Source:** https://docs.consumet.org/rest-api/Movies/dramacool/get-popular-drama

API

Movies

Dramacool

Get Popular Drama

# Get Popular Drama

Technical details regarding the usage of the get popular drama function for the Dramacool provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/dramacool/popular
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/movies/dramacool/popular";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 0,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "url": "string"
    }
  ]
}
```

[Spotlight](/rest-api/Movies/dramacool/spotlight "Spotlight")[Search](/rest-api/Movies/flixhq/search "Search")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Movies/dramacool/search

API

Movies

Dramacool

Search

# Search

Technical details regarding the usage of the search function for the Dramacool provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/dramacool/{query}?page={number}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes | `""` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "vincenzo", and looking at the 2nd page of results.
const url = "https://api.consumet.org/movies/dramacool/vincenzo";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
"currentPage": 1,
"hasNextPage": true,
"results": [
    {
      "id": "string",
      "url": "string",
      "title": "string",
      "image": "string",
      "releaseDate": "string",
      "type": "Tv Series",
    }
  ]
}
```

[Image Proxy](/rest-api/Manga/weebcentral/proxy "Image Proxy")[Get Movie Info](/rest-api/Movies/dramacool/get-movie-info "Get Movie Info")
---

# Spotlight

**Source:** https://docs.consumet.org/rest-api/Movies/dramacool/spotlight

API

Movies

Dramacool

Spotlight

# Spotlight

Get the spotlight/featured content from DramaCool homepage.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/dramacool/spotlight
```

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/movies/dramacool/spotlight";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "id": "string",
    "title": "string",
    "image": "string",
    "url": "string",
    "type": "string"
  }
]
```

[Get Movie Episode Streaming Links](/rest-api/Movies/dramacool/get-movie-episode-streaming-links "Get Movie Episode Streaming Links")[Get Popular Drama](/rest-api/Movies/dramacool/get-popular-drama "Get Popular Drama")
---

# Browse by Country

**Source:** https://docs.consumet.org/rest-api/Movies/flixhq/by-country

API

Movies

FlixHQ

Browse by Country

# Browse by Country

Technical details regarding the usage of the browse by country function for the Flixhq provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/flixhq/country/{country}?page={page}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| country | string | The country to filter by (e.g., united-states, united-kingdom, japan, korean). | Yes | `""` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example country "united-states", and looking at the 1st page of results.
const url = "https://api.consumet.org/movies/flixhq/country/united-states";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string", // or null
      "duration": "string", // or null
      "type": "Movie" // or "TV Series"
    }
  ]
}
```

[Recent TV Shows](/rest-api/Movies/flixhq/recent-tv-shows "Recent TV Shows")[Browse by Genre](/rest-api/Movies/flixhq/by-genre "Browse by Genre")
---

# Browse by Genre

**Source:** https://docs.consumet.org/rest-api/Movies/flixhq/by-genre

API

Movies

FlixHQ

Browse by Genre

# Browse by Genre

Technical details regarding the usage of the browse by genre function for the Flixhq provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/flixhq/genre/{genre}?page={page}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| genre | string | The genre to filter by (e.g., action, comedy, drama, sci-fi, animation). | Yes | `""` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example genre "action", and looking at the 1st page of results.
const url = "https://api.consumet.org/movies/flixhq/genre/action";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 1 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "image": "string",
      "releaseDate": "string", // or null
      "duration": "string", // or null
      "type": "Movie" // or "TV Series"
    }
  ]
}
```

[Browse by Country](/rest-api/Movies/flixhq/by-country "Browse by Country")[Search](/rest-api/Movies/goku/search "Search")
---

# Get Movie's Episode Available Servers

**Source:** https://docs.consumet.org/rest-api/Movies/flixhq/get-movie-episode-available-servers

API

Movies

FlixHQ

Get Movie Episode Available Servers

# Get Movie's Episode Available Servers

Technical details regarding the usage of the get available servers function for the GogoAnime provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/flixhq/servers?episodeId={episodeId}&mediaId={mediaId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The Episode's id you want the servers for | Yes | `""` |
| mediaId | string | The movie info ID | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example episode ID of '10766' and the mediaId of 'tv/watch-rick-and-morty-39480'.
const url = "https://api.consumet.org/movies/flixhq/servers";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { episodeId: "10766", mediaId: "tv/watch-rick-and-morty-39480" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
      "name": "string",
      "url": "string"
  }
]
```

[Get Movie Episode Streaming Links](/rest-api/Movies/flixhq/get-movie-episode-streaming-links "Get Movie Episode Streaming Links")[Spotlight](/rest-api/Movies/flixhq/spotlight "Spotlight")
---

# Get Anime Episode Streaming Links

**Source:** https://docs.consumet.org/rest-api/Movies/flixhq/get-movie-episode-streaming-links

API

Movies

FlixHQ

Get Movie Episode Streaming Links

# Get Anime Episode Streaming Links

Technical details regarding the usage of the get anime streaming links function for the Flixhq provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/flixhq/watch?episodeId={episodeId}&mediaId={mediaId}&server={server}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The ID of the selected episode | Yes | N/A |
| mediaId | string | The movie info ID | Yes | N/A |
| server | Enum: `"mixdrop"` `"vidcloud"` `"upcloud"` | The server the episode will use | No | `"vidcloud"` |

## Request Samples

```javascript
import axios from "axios";
 
/*
Using the example episode ID of 'spy-x-family-episode-1',
explicitly defining default server for demostrative purposes.
*/
const url = "https://api.consumet.org/movies/flixhq/watch";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { episodeId: "10766", mediaId: "tv/watch-rick-and-morty-39480", server: "upcloud" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
    "headers": {
        "Referer": "string"
    },
    "sources": [
        {
        "url": "string",
        "quality": "string",
        "isM3U8": true
        }
    ],
    "subtitles": [
        {
        "url": "string",
        "lang": "string"
        }
    ]
}
```

[Get Movie Info](/rest-api/Movies/flixhq/get-movie-info "Get Movie Info")[Get Movie Episode Available Servers](/rest-api/Movies/flixhq/get-movie-episode-available-servers "Get Movie Episode Available Servers")
---

# Movie Info

**Source:** https://docs.consumet.org/rest-api/Movies/flixhq/get-movie-info

API

Movies

FlixHQ

Get Movie Info

# Movie Info

Technical details regarding the usage of the get anime info function for the Flixhq provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/flixhq/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The Flixhq ID of the show / movie; i.e. provided by searching for said show and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "tv/watch-vincenzo-67955", and looking at the 2nd page of results.
const url = "https://api.consumet.org/movies/flixhq/info?id=tv/watch-vincenzo-67955";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "url": "string",
  "image": "string",
  "releaseDate": "string",
  "description": "string",
  "geners": [
      "string"
  ],
  "type": "Movie",
  "casts": [
      "string"
  ],
  "tags": [
      "string"
  ],
  "production": "string",
  "duration": "string",
  "episodes": [
      {
      "id": "string",
      "url": "string",
      "title": "string",
      "number": 0,
      "season": 0
      }
  ]
}
```

[Search](/rest-api/Movies/flixhq/search "Search")[Get Movie Episode Streaming Links](/rest-api/Movies/flixhq/get-movie-episode-streaming-links "Get Movie Episode Streaming Links")
---

# Get Trending

**Source:** https://docs.consumet.org/rest-api/Movies/flixhq/get-trending

API

Movies

FlixHQ

Get Trending

# Get Trending

Technical details regarding the usage of the get trending movies function for the Flixhq provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/flixhq/trending
```

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/movies/flixhq/trending";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "url": "string",
      "releaseDate": "string", // or null
      "duration": "string", // or null
      "type": "Movie" // or "TV Series"
    }
  ]
}
```

[Spotlight](/rest-api/Movies/flixhq/spotlight "Spotlight")[Recent Movies](/rest-api/Movies/flixhq/recent-movies "Recent Movies")
---

# Get Recent Movies

**Source:** https://docs.consumet.org/rest-api/Movies/flixhq/recent-movies

API

Movies

FlixHQ

Recent Movies

# Get Recent Movies

Technical details regarding the usage of the get recent movies function for the Flixhq provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/flixhq/recent-movies
```

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/movies/flixhq/recent-movies";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "id": "string",
    "title": "string",
    "url": "string",
    "image": "string",
    "releaseDate": "string",
    "duration": "string",
    "type": "Movie"
  }
]
```

[Get Trending](/rest-api/Movies/flixhq/get-trending "Get Trending")[Recent TV Shows](/rest-api/Movies/flixhq/recent-tv-shows "Recent TV Shows")
---

# Get Recent TV Shows

**Source:** https://docs.consumet.org/rest-api/Movies/flixhq/recent-tv-shows

API

Movies

FlixHQ

Recent TV Shows

# Get Recent TV Shows

Technical details regarding the usage of the get recent TV shows function for the Flixhq provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/flixhq/recent-shows
```

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/movies/flixhq/recent-shows";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "id": "string",
    "title": "string",
    "url": "string",
    "image": "string",
    "season": "string",
    "latestEpisode": "string",
    "type": "TV Series"
  }
]
```

[Recent Movies](/rest-api/Movies/flixhq/recent-movies "Recent Movies")[Browse by Country](/rest-api/Movies/flixhq/by-country "Browse by Country")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Movies/flixhq/search

API

Movies

FlixHQ

Search

# Search

Technical details regarding the usage of the search function for the Flixhq provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/flixhq/{query}?page={number}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes | `""` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "flash", and looking at the 2nd page of results.
const url = "https://api.consumet.org/movies/flixhq/flash";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 2 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
"currentPage": 1,
"hasNextPage": true,
"results": [
    {
      "id": "string",
      "url": "string",
      "title": "string",
      "image": "string",
      "releaseDate": "string",
      "type": "Movie"
    }
  ]
}
```

[Get Popular Drama](/rest-api/Movies/dramacool/get-popular-drama "Get Popular Drama")[Get Movie Info](/rest-api/Movies/flixhq/get-movie-info "Get Movie Info")
---

# Get Spotlight

**Source:** https://docs.consumet.org/rest-api/Movies/flixhq/spotlight

API

Movies

FlixHQ

Spotlight

# Get Spotlight

Technical details regarding the usage of the get spotlight/featured content function for the Flixhq provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/flixhq/spotlight
```

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/movies/flixhq/spotlight";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "cover": "string",
      "description": "string",
      "rating": "string",
      "duration": "string",
      "genres": ["string"],
      "type": "Movie" // or "TV Series"
    }
  ]
}
```

[Get Movie Episode Available Servers](/rest-api/Movies/flixhq/get-movie-episode-available-servers "Get Movie Episode Available Servers")[Get Trending](/rest-api/Movies/flixhq/get-trending "Get Trending")
---

# Get Episode Servers

**Source:** https://docs.consumet.org/rest-api/Movies/goku/get-episode-servers

API

Movies

Goku

Get Episode Servers

# Get Episode Servers

Technical details regarding the usage of the get available servers function for the Goku provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/goku/servers?episodeId={episodeId}&mediaId={mediaId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The Episode's ID you want the servers for | Yes | `""` |
| mediaId | string | The movie/show info ID | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example episode ID and media ID
const url = "https://api.consumet.org/movies/goku/servers";
const data = async () => {
    try {
        const { data } = await axios.get(url, { 
          params: { 
            episodeId: "12345", 
            mediaId: "movie/watch-avengers-endgame-19612" 
          } 
        });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "name": "string",
    "url": "string"
  }
]
```

[Get Episode Streaming Links](/rest-api/Movies/goku/get-episode-streaming-links "Get Episode Streaming Links")[Trending](/rest-api/Movies/goku/trending "Trending")
---

# Get Episode Streaming Links

**Source:** https://docs.consumet.org/rest-api/Movies/goku/get-episode-streaming-links

API

Movies

Goku

Get Episode Streaming Links

# Get Episode Streaming Links

Technical details regarding the usage of the get streaming links function for the Goku provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/goku/watch?episodeId={episodeId}&mediaId={mediaId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The ID of the selected episode | Yes | N/A |
| mediaId | string | The movie/show info ID | Yes | N/A |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example episode ID and media ID
const url = "https://api.consumet.org/movies/goku/watch";
const data = async () => {
    try {
        const { data } = await axios.get(url, { 
          params: { 
            episodeId: "12345", 
            mediaId: "movie/watch-avengers-endgame-19612" 
          } 
        });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "headers": {
    "Referer": "string"
  },
  "sources": [
    {
      "url": "string",
      "quality": "string",
      "isM3U8": true
    }
  ],
  "subtitles": [
    {
      "url": "string",
      "lang": "string"
    }
  ]
}
```

[Get Media Info](/rest-api/Movies/goku/get-media-info "Get Media Info")[Get Episode Servers](/rest-api/Movies/goku/get-episode-servers "Get Episode Servers")
---

# Media Info

**Source:** https://docs.consumet.org/rest-api/Movies/goku/get-media-info

API

Movies

Goku

Get Media Info

# Media Info

Technical details regarding the usage of the get media info function for the Goku provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/goku/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The Goku ID of the show / movie; i.e. provided by searching for said show and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example id "movie/watch-avengers-endgame-19612"
const url = "https://api.consumet.org/movies/goku/info";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { id: "movie/watch-avengers-endgame-19612" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "url": "string",
  "image": "string",
  "releaseDate": "string",
  "description": "string",
  "genres": [
    "string"
  ],
  "type": "Movie",
  "casts": [
    "string"
  ],
  "tags": [
    "string"
  ],
  "production": "string",
  "duration": "string",
  "episodes": [
    {
      "id": "string",
      "url": "string",
      "title": "string",
      "number": 0,
      "season": 0
    }
  ]
}
```

[Search](/rest-api/Movies/goku/search "Search")[Get Episode Streaming Links](/rest-api/Movies/goku/get-episode-streaming-links "Get Episode Streaming Links")
---

# Get Recent Movies

**Source:** https://docs.consumet.org/rest-api/Movies/goku/recent-movies

API

Movies

Goku

Recent Movies

# Get Recent Movies

Technical details regarding the usage of the get recent movies function for the Goku provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/goku/recent-movies
```

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/movies/goku/recent-movies";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "url": "string",
      "releaseDate": "string",
      "duration": "string",
      "type": "Movie"
    }
  ]
}
```

[Trending](/rest-api/Movies/goku/trending "Trending")[Recent TV Shows](/rest-api/Movies/goku/recent-tv-shows "Recent TV Shows")
---

# Get Recent TV Shows

**Source:** https://docs.consumet.org/rest-api/Movies/goku/recent-tv-shows

API

Movies

Goku

Recent TV Shows

# Get Recent TV Shows

Technical details regarding the usage of the get recent TV shows function for the Goku provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/goku/recent-tv-shows
```

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/movies/goku/recent-tv-shows";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "url": "string",
      "releaseDate": "string",
      "duration": "string",
      "type": "TV Series"
    }
  ]
}
```

[Recent Movies](/rest-api/Movies/goku/recent-movies "Recent Movies")[Search](/rest-api/Movies/sflix/search "Search")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Movies/goku/search

API

Movies

Goku

Search

# Search

Technical details regarding the usage of the search function for the Goku provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/goku/{query}?page={page}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes | `""` |

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| page | integer | The page number of results to return. | No | `1` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "avengers", and looking at the 2nd page of results.
const url = "https://api.consumet.org/movies/goku/avengers";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { page: 2 } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "url": "string",
      "title": "string",
      "image": "string",
      "releaseDate": "string",
      "type": "Movie"
    }
  ]
}
```

[Browse by Genre](/rest-api/Movies/flixhq/by-genre "Browse by Genre")[Get Media Info](/rest-api/Movies/goku/get-media-info "Get Media Info")
---

# Get Trending

**Source:** https://docs.consumet.org/rest-api/Movies/goku/trending

API

Movies

Goku

Trending

# Get Trending

Technical details regarding the usage of the get trending function for the Goku provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/goku/trending?type={type}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| type | Enum: `"movie"` `"tv-series"` | The type of media to get trending for | No | `"movie"` |

## Request Samples

```javascript
import axios from "axios";
 
// Get trending movies
const url = "https://api.consumet.org/movies/goku/trending";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { type: "movie" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "url": "string",
      "releaseDate": "string",
      "duration": "string",
      "type": "Movie"
    }
  ]
}
```

[Get Episode Servers](/rest-api/Movies/goku/get-episode-servers "Get Episode Servers")[Recent Movies](/rest-api/Movies/goku/recent-movies "Recent Movies")
---

# Get Episode Servers

**Source:** https://docs.consumet.org/rest-api/Movies/himovies/get-episode-servers

API

Movies

HiMovies

Get Episode Servers

# Get Episode Servers

Technical details regarding the usage of the get available servers function for the HiMovies provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/himovies/servers?episodeId={episodeId}&mediaId={mediaId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The Episode's ID you want the servers for | Yes | `""` |
| mediaId | string | The movie/show info ID | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example episode ID and media ID
const url = "https://api.consumet.org/movies/himovies/servers";
const data = async () => {
    try {
        const { data } = await axios.get(url, { 
          params: { 
            episodeId: "5678", 
            mediaId: "movie/watch-inception-12345" 
          } 
        });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "name": "string",
    "url": "string"
  }
]
```

[Get Episode Streaming Links](/rest-api/Movies/himovies/get-episode-streaming-links "Get Episode Streaming Links")[Trending](/rest-api/Movies/himovies/trending "Trending")
---

# Get Episode Streaming Links

**Source:** https://docs.consumet.org/rest-api/Movies/himovies/get-episode-streaming-links

API

Movies

HiMovies

Get Episode Streaming Links

# Get Episode Streaming Links

Technical details regarding the usage of the get streaming links function for the HiMovies provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/himovies/watch?episodeId={episodeId}&mediaId={mediaId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The ID of the selected episode | Yes | N/A |
| mediaId | string | The movie/show info ID | Yes | N/A |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example episode ID and media ID
const url = "https://api.consumet.org/movies/himovies/watch";
const data = async () => {
    try {
        const { data } = await axios.get(url, { 
          params: { 
            episodeId: "5678", 
            mediaId: "movie/watch-inception-12345" 
          } 
        });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "headers": {
    "Referer": "string"
  },
  "sources": [
    {
      "url": "string",
      "quality": "string",
      "isM3U8": true
    }
  ],
  "subtitles": [
    {
      "url": "string",
      "lang": "string"
    }
  ]
}
```

[Get Media Info](/rest-api/Movies/himovies/get-media-info "Get Media Info")[Get Episode Servers](/rest-api/Movies/himovies/get-episode-servers "Get Episode Servers")
---

# Media Info

**Source:** https://docs.consumet.org/rest-api/Movies/himovies/get-media-info

API

Movies

HiMovies

Get Media Info

# Media Info

Technical details regarding the usage of the get media info function for the HiMovies provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/himovies/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The HiMovies ID of the show / movie; i.e. provided by searching for said show and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example id "movie/watch-inception-12345"
const url = "https://api.consumet.org/movies/himovies/info";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { id: "movie/watch-inception-12345" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "url": "string",
  "image": "string",
  "releaseDate": "string",
  "description": "string",
  "genres": [
    "string"
  ],
  "type": "Movie",
  "casts": [
    "string"
  ],
  "tags": [
    "string"
  ],
  "production": "string",
  "duration": "string",
  "episodes": [
    {
      "id": "string",
      "url": "string",
      "title": "string",
      "number": 0,
      "season": 0
    }
  ]
}
```

[Search](/rest-api/Movies/himovies/search "Search")[Get Episode Streaming Links](/rest-api/Movies/himovies/get-episode-streaming-links "Get Episode Streaming Links")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Movies/himovies/search

API

Movies

HiMovies

Search

# Search

Technical details regarding the usage of the search function for the HiMovies provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/himovies/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "inception"
const url = "https://api.consumet.org/movies/himovies/inception";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "url": "string",
      "title": "string",
      "image": "string",
      "releaseDate": "string",
      "type": "Movie"
    }
  ]
}
```

[Trending](/rest-api/Movies/sflix/trending "Trending")[Get Media Info](/rest-api/Movies/himovies/get-media-info "Get Media Info")
---

# Get Trending

**Source:** https://docs.consumet.org/rest-api/Movies/himovies/trending

API

Movies

HiMovies

Trending

# Get Trending

Technical details regarding the usage of the get trending function for the HiMovies provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/himovies/trending?type={type}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| type | Enum: `"movie"` `"tv-series"` | The type of media to get trending for | No | `"movie"` |

## Request Samples

```javascript
import axios from "axios";
 
// Get trending movies
const url = "https://api.consumet.org/movies/himovies/trending";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { type: "movie" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "url": "string",
      "releaseDate": "string",
      "duration": "string",
      "type": "Movie"
    }
  ]
}
```

[Get Episode Servers](/rest-api/Movies/himovies/get-episode-servers "Get Episode Servers")[Search](/rest-api/Movies/turkish123/search "Search")
---

# Get Episode Servers

**Source:** https://docs.consumet.org/rest-api/Movies/sflix/get-episode-servers

API

Movies

SFlix

Get Episode Servers

# Get Episode Servers

Technical details regarding the usage of the get available servers function for the SFlix provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/sflix/servers?episodeId={episodeId}&mediaId={mediaId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The Episode's ID you want the servers for | Yes | `""` |
| mediaId | string | The movie/show info ID | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example episode ID and media ID
const url = "https://api.consumet.org/movies/sflix/servers";
const data = async () => {
    try {
        const { data } = await axios.get(url, { 
          params: { 
            episodeId: "1001", 
            mediaId: "tv/watch-breaking-bad-39441" 
          } 
        });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "name": "string",
    "url": "string"
  }
]
```

[Get Episode Streaming Links](/rest-api/Movies/sflix/get-episode-streaming-links "Get Episode Streaming Links")[Spotlight](/rest-api/Movies/sflix/spotlight "Spotlight")
---

# Get Episode Streaming Links

**Source:** https://docs.consumet.org/rest-api/Movies/sflix/get-episode-streaming-links

API

Movies

SFlix

Get Episode Streaming Links

# Get Episode Streaming Links

Technical details regarding the usage of the get streaming links function for the SFlix provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/sflix/watch?episodeId={episodeId}&mediaId={mediaId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The ID of the selected episode | Yes | N/A |
| mediaId | string | The movie/show info ID | Yes | N/A |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example episode ID and media ID
const url = "https://api.consumet.org/movies/sflix/watch";
const data = async () => {
    try {
        const { data } = await axios.get(url, { 
          params: { 
            episodeId: "1001", 
            mediaId: "tv/watch-breaking-bad-39441" 
          } 
        });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "headers": {
    "Referer": "string"
  },
  "sources": [
    {
      "url": "string",
      "quality": "string",
      "isM3U8": true
    }
  ],
  "subtitles": [
    {
      "url": "string",
      "lang": "string"
    }
  ]
}
```

[Get Media Info](/rest-api/Movies/sflix/get-media-info "Get Media Info")[Get Episode Servers](/rest-api/Movies/sflix/get-episode-servers "Get Episode Servers")
---

# Media Info

**Source:** https://docs.consumet.org/rest-api/Movies/sflix/get-media-info

API

Movies

SFlix

Get Media Info

# Media Info

Technical details regarding the usage of the get media info function for the SFlix provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/sflix/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The SFlix ID of the show / movie; i.e. provided by searching for said show and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example id "tv/watch-breaking-bad-39441"
const url = "https://api.consumet.org/movies/sflix/info";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { id: "tv/watch-breaking-bad-39441" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "url": "string",
  "image": "string",
  "releaseDate": "string",
  "description": "string",
  "genres": [
    "string"
  ],
  "type": "Movie",
  "casts": [
    "string"
  ],
  "tags": [
    "string"
  ],
  "production": "string",
  "duration": "string",
  "episodes": [
    {
      "id": "string",
      "url": "string",
      "title": "string",
      "number": 0,
      "season": 0
    }
  ]
}
```

[Search](/rest-api/Movies/sflix/search "Search")[Get Episode Streaming Links](/rest-api/Movies/sflix/get-episode-streaming-links "Get Episode Streaming Links")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Movies/sflix/search

API

Movies

SFlix

Search

# Search

Technical details regarding the usage of the search function for the SFlix provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/sflix/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the item you are looking for. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "breaking bad"
const url = "https://api.consumet.org/movies/sflix/breaking bad";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "string",
      "url": "string",
      "title": "string",
      "image": "string",
      "releaseDate": "string",
      "type": "Movie"
    }
  ]
}
```

[Recent TV Shows](/rest-api/Movies/goku/recent-tv-shows "Recent TV Shows")[Get Media Info](/rest-api/Movies/sflix/get-media-info "Get Media Info")
---

# Get Spotlight

**Source:** https://docs.consumet.org/rest-api/Movies/sflix/spotlight

API

Movies

SFlix

Spotlight

# Get Spotlight

Technical details regarding the usage of the get spotlight function for the SFlix provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/sflix/spotlight
```

## Request Samples

```javascript
import axios from "axios";
 
const url = "https://api.consumet.org/movies/sflix/spotlight";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "url": "string",
      "releaseDate": "string",
      "duration": "string",
      "type": "Movie"
    }
  ]
}
```

[Get Episode Servers](/rest-api/Movies/sflix/get-episode-servers "Get Episode Servers")[Trending](/rest-api/Movies/sflix/trending "Trending")
---

# Get Trending

**Source:** https://docs.consumet.org/rest-api/Movies/sflix/trending

API

Movies

SFlix

Trending

# Get Trending

Technical details regarding the usage of the get trending function for the SFlix provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/sflix/trending?type={type}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| type | Enum: `"movie"` `"tv-series"` | The type of media to get trending for | No | `"movie"` |

## Request Samples

```javascript
import axios from "axios";
 
// Get trending movies
const url = "https://api.consumet.org/movies/sflix/trending";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { type: "movie" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "image": "string",
      "url": "string",
      "releaseDate": "string",
      "duration": "string",
      "type": "Movie"
    }
  ]
}
```

[Spotlight](/rest-api/Movies/sflix/spotlight "Spotlight")[Search](/rest-api/Movies/himovies/search "Search")
---

# Get Episode Streaming Links

**Source:** https://docs.consumet.org/rest-api/Movies/turkish123/get-episode-streaming-links

API

Movies

Turkish123

Get Episode Streaming Links

# Get Episode Streaming Links

Technical details regarding the usage of the get episode streaming links function for the Turkish123 provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/turkish123/watch?episodeId={episodeId}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| episodeId | string | The episode ID of the episode you want to watch. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example episode ID "erkenci-kus-episode-1".
const url = "https://api.consumet.org/movies/turkish123/watch";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { episodeId: "erkenci-kus-episode-1" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "sources": [
    {
      "url": "string",
      "quality": "string",
      "isM3U8": true
    }
  ],
  "subtitles": [
    {
      "url": "string",
      "lang": "string"
    }
  ]
}
```

[Get Media Info](/rest-api/Movies/turkish123/get-media-info "Get Media Info")[Fetch News Feeds](/rest-api/News/animenewsnetwork/fetch-news-feeds "Fetch News Feeds")
---

# Get Media Info

**Source:** https://docs.consumet.org/rest-api/Movies/turkish123/get-media-info

API

Movies

Turkish123

Get Media Info

# Get Media Info

Technical details regarding the usage of the get media info function for the Turkish123 provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/turkish123/info?id={id}
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | The Turkish123 ID of the drama; i.e. provided by searching for said drama and selecting the correct one. | Yes |  |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example ID "erkenci-kus".
const url = "https://api.consumet.org/movies/turkish123/info";
const data = async () => {
    try {
        const { data } = await axios.get(url, { params: { id: "erkenci-kus" } });
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
{
  "id": "string",
  "title": "string",
  "url": "string",
  "image": "string",
  "description": "string",
  "type": "string",
  "releaseDate": "string",
  "episodes": [
    {
      "id": "string",
      "title": "string",
      "number": 0,
      "url": "string"
    }
  ]
}
```

[Search](/rest-api/Movies/turkish123/search "Search")[Get Episode Streaming Links](/rest-api/Movies/turkish123/get-episode-streaming-links "Get Episode Streaming Links")
---

# Search

**Source:** https://docs.consumet.org/rest-api/Movies/turkish123/search

API

Movies

Turkish123

Search

# Search

Technical details regarding the usage of the search function for the Turkish123 provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/movies/turkish123/{query}
```

## Path Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| query | string | The search query; i.e. the title of the Turkish drama you are looking for. | Yes | `""` |

## Request Samples

```javascript
import axios from "axios";
 
// Using the example query "erkenci kus".
const url = "https://api.consumet.org/movies/turkish123/erkenci%20kus";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    "id": "string",
    "title": "string",
    "url": "string",
    "image": "string",
    "type": "string"
  }
]
```

[Trending](/rest-api/Movies/himovies/trending "Trending")[Get Media Info](/rest-api/Movies/turkish123/get-media-info "Get Media Info")
---

# Fetch News Feeds

**Source:** https://docs.consumet.org/rest-api/News/animenewsnetwork/fetch-news-feeds

API

News

AnimeNewsNetwork

Fetch News Feeds

# Fetch News Feeds

Technical details regarding the usage of the fetch news feeds function for the ANN provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/news/ann/recent-feeds
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| topic | Enum:  `"anime"` `"animation"` `"manga"` `"games"` `"novels"` `"live-action"` `"covid-19"` `"industry"` `"music"` `"people"` `"merch"` `"events"` | This Controls the topic of the news that will be returned in the request. | No | N/A |

## Request Samples

```javascript
import axios from "axios";
 
// Example request using no paramters, which fetches all recent news.
const url = "https://api.consumet.org/news/ann/recent-feeds";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
      "title": "string",
      "id": "string",
      "uploadedAt": "string",
      "topics": [
          "string"
      ],
      "preview": {
          "intro": "string",
          "full": "string"
      },
      "thumbnail": "string",
      "url": "string"
  },
]
```

[Get Episode Streaming Links](/rest-api/Movies/turkish123/get-episode-streaming-links "Get Episode Streaming Links")[Fetch News Info](/rest-api/News/animenewsnetwork/fetch-news-info "Fetch News Info")
---

# Fetch News Feeds

**Source:** https://docs.consumet.org/rest-api/News/animenewsnetwork/fetch-news-info

API

News

AnimeNewsNetwork

Fetch News Info

# Fetch News Feeds

Technical details regarding the usage of the fetch news info function for the ANN provider can be found below. Example code is provided for both JavaScript and Python, along with a response schema.

## Route Schema (URL)

```javascript
https://api.consumet.org/news/ann/info
```

## Query Parameters

| Parameter | Type | Description | Required? | Default |
| --- | --- | --- | --- | --- |
| id | string | This is the ID of the news story that will be returned in the function. | Yes | N/A |

## Request Samples

```javascript
import axios from "axios";
 
// An example news story about the Kindaichi Case Files ending.
const url = "https://api.consumet.org/news/ann/info?id=2023-04-26/kibo-no-chikara-~otona-precure-23~-anime-teaser-narrated-by-nozomi-yuko-sanpei/.197525";
const data = async () => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
 
console.log(data);
```

## Response Schema

**MIME Type:** `application/json`

```javascript
[
  {
    id: "string",
    title: "string",
    uploadedAt: "string",
    intro: "string",
    description: "string",
    thumbnail: "string",
    url: "string"
  }
]
```

[Fetch News Feeds](/rest-api/News/animenewsnetwork/fetch-news-feeds "Fetch News Feeds")[Get Started](/node-library/start "Get Started")
---

# Get Started

**Source:** https://docs.consumet.org/rest-api/start

API

Get Started

# Get Started

The base URL for the Consumet REST API is: [`https://api.consumet.org` (opens in a new tab)](https://api.consumet.org)

## Notes

* Some `GET` request examples displayed throughout these docs are written for use with Node.js - the [`axios` (opens in a new tab)](https://axios-http.com) library may be required.
* Some `GET` request examples displayed throughout these docs are written for use with Python - the [`requests` (opens in a new tab)](https://requests.readthedocs.io) library may be required.

[FAQ](/faq "FAQ")[Search](/rest-api/Anime/animekai/search "Search")
---

