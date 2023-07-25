
# Vislap Project

A backend API for Vislap Project


## Installation

Install vislap-project with npm

```bash
  npm install

  or
  yarn install

  or
  pnpm install
```
    
## Users API Reference

#### Users Login

```http
  POST /users/login
```

| Body       | Type     | Description                  |
| :--------- | :------- | :--------------------------- |
| `email`    | `email`  | **Required**. users email    |
| `password` | `string` | **Required**. users password |

#### Users Register

```http
  POST /users/register
```

| Body               | Type     | Description                  |
| :----------------- | :--------| :--------------------------- |
| `name`             | `string` | **Required**. users name     |
| `email`            | `email`  | **Required**. users email    |
| `password`         | `string` | **Required**. users password |
| `confirm_password` | `string` | **Required**. confirm password |

#### Get Users Profile

```http
  GET /users/profile/
```

| Header               | Type    | Description                |
| :------------------- | :------ | :------------------------- |
| `Authorization`      | `Token` | **Required**. Bearer Token |

#### Edit Users Profile

```http
  PUT /users/profile/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of users to fetch |

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. users name |
| `alamat`      | `string` | **Required**. users alamat |
| `provinsi`      | `string` | **Required**. users provinsi |
| `kota`      | `string` | **Required**. users kota |
| `kecamatan`      | `string` | **Required**. users kecamatan |

#### Users Logout

```http
  DELETE /users/logout
```

| Cookie               | Type     | Description                       |
| :------------------- | :------- | :-------------------------------- |
| `refreshToken`       | `cookie` | **Required**. refreshToken cookie |


## Admins API Reference

#### Admins Login

```http
  POST /admins/login
```

| Body       | Type     | Description                  |
| :--------- | :------- | :--------------------------- |
| `email`    | `email`  | **Required**. admins email    |
| `password` | `string` | **Required**. admins password |

#### Admins Register

```http
  POST /admins/register
```

| Body               | Type     | Description                  |
| :----------------- | :--------| :--------------------------- |
| `name`             | `string` | **Required**. admins name     |
| `email`            | `email`  | **Required**. admins email    |
| `password`         | `string` | **Required**. admins password |
| `confirm_password` | `string` | **Required**. confirm password |

#### Get Admins Profile

```http
  GET /admins/profile/
```

| Header               | Type    | Description                |
| :------------------- | :------ | :------------------------- |
| `Authorization`      | `Token` | **Required**. Bearer Token |

#### Edit Admins Profile

```http
  PUT /admins/profile/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of admins to fetch |

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. admins name |
| `email`      | `email` | **Required**. admins email |

#### Admins Logout

```http
  DELETE /admins/logout
```

| Cookie               | Type     | Description                       |
| :------------------- | :------- | :-------------------------------- |
| `refreshToken`       | `cookie` | **Required**. refreshToken cookie |


## Category API Reference

#### Get Category

```http
  GET /category
```

| Header               | Type    | Description                |
| :------------------- | :------ | :------------------------- |
| `Authorization`      | `Token` | **Required**. Bearer Token |

#### Get Category By Id

```http
  GET /category/${id}
```

| Header               | Type    | Description                |
| :------------------- | :------ | :------------------------- |
| `Authorization`      | `Token` | **Required**. Bearer Token |

| Parameter | Type    | Description                             |
| :-------- | :------- | :------------------------------------- |
| `id`      | `string` | **Required**. id for fetching category |

#### Add Category

```http
  POST /category
```

| Body       | Type     | Description                    |
| :--------- | :------- | :----------------------------- |
| `name`    | `string`  | **Required**. Category name    |


#### Edit Category 

```http
  PUT /category/${id}
```

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `id`      | `string` | **Required**. Id of Category to fetch |

| Body        | Type     | Description                 |
| :---------- | :------- | :-------------------------- |
| `name`      | `string` | **Required**. Category name |

#### Delete Category

```http
  DELETE /category/${id}
```

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `id`      | `string` | **Required**. Id of Category to fetch |

| Cookie               | Type     | Description                       |
| :------------------- | :------- | :-------------------------------- |
| `refreshToken`       | `cookie` | **Required**. refreshToken cookie |