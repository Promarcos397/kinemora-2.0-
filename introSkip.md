# IntroDB API v1.0.0

**Source JSON:** `http://api.introdb.app/openapi.json`

Public API for fetching TV show intro timestamps

---

## Authentication

- **Type:** apiKey
- **Header Name:** `X-API-Key`
- **Description:** API key for programmatic submissions (format: idb_...)

---

## Endpoints

### Get intro timestamps for an episode

**Route:** `GET` `/intro`


Returns the aggregated intro start/end times for a specific TV show episode. Crowdsourced data from community submissions.


**Parameters**

| Name | In | Required | Description |
|------|----|----------|-------------|
| imdb_id | query | Yes | IMDb ID (e.g., tt0944947 for Game of Thrones) |
| season | query | Yes | Season number (starting from 1) |
| episode | query | Yes | Episode number (starting from 1) |


**Example Request (Python)**
```python
import requests
url = '[http://api.introdb.app](http://api.introdb.app)/intro'
params = {"imdb_id": "VALUE", "season": "VALUE", "episode": "VALUE"}
response = requests.get(url, params=params)
print(response.json())
```

---

### Submit intro timestamps (API key required)

**Route:** `POST` `/submit`


Submit intro timestamps for a TV show episode using your API key. Submissions appear in your account and contribute to crowdsourced data after verification.

**Example Request (Python)**
```python
import requests
url = '[http://api.introdb.app](http://api.introdb.app)/submit'
response = requests.post(url)
print(response.json())
```

---



# IntroDB API v1.0.0

**Source JSON:** `http://api.introdb.app/openapi.json`

Public API for fetching TV show intro timestamps

---

## Authentication

- **Type:** apiKey
- **Header Name:** `X-API-Key`
- **Description:** API key for programmatic submissions (format: idb_...)

---

## Endpoints

### Get intro timestamps for an episode

**Route:** `GET` `/intro`


Returns the aggregated intro start/end times for a specific TV show episode. Crowdsourced data from community submissions.


**Parameters**

| Name | In | Required | Description |
|------|----|----------|-------------|
| imdb_id | query | Yes | IMDb ID (e.g., tt0944947 for Game of Thrones) |
| season | query | Yes | Season number (starting from 1) |
| episode | query | Yes | Episode number (starting from 1) |


**Example Request (Python)**
```python
import requests
url = '[http://api.introdb.app](http://api.introdb.app)/intro'
params = {"imdb_id": "VALUE", "season": "VALUE", "episode": "VALUE"}
response = requests.get(url, params=params)
print(response.json())
```

---

### Submit intro timestamps (API key required)

**Route:** `POST` `/submit`


Submit intro timestamps for a TV show episode using your API key. Submissions appear in your account and contribute to crowdsourced data after verification.

**Example Request (Python)**
```python
import requests
url = '[http://api.introdb.app](http://api.introdb.app)/submit'
response = requests.post(url)
print(response.json())
```

---


