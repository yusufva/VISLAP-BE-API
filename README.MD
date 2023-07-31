
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

| Header               | Type    | Description                      |
| :------------------- | :------ | :------------------------------- |
| `Authorization`      | `Token` | **Required**. Admin Bearer Token |


## Products API Reference

#### Get Products

```http
  GET /products
```


#### Get Products By Id

```http
  GET /products/${id}
```

| Parameter | Type    | Description                             |
| :-------- | :------- | :------------------------------------- |
| `id`      | `string` | **Required**. id for fetching Products |

#### Add Products

```http
  POST /products
```

| Header               | Type    | Description                      |
| :------------------- | :------ | :------------------------------- |
| `Authorization`      | `Token` | **Required**. Admin Bearer Token |

| Body       | Type          | Description                     |
| :--------- | :------------ | :-----------------------------  |
| `nama`     | `string`      | **Required**. Products nama     |
| `harga`    | `string`      | **Required**. Products harga    |
| `kategori` | `string`      | **Required**. Products kategori |
| `stock`    | `string`      | **Required**. Products stock    |
| `img`      | `file image`  | **Required**. Products img      |


#### Edit Products 

```http
  PUT /products/${id}
```

| Header               | Type    | Description                      |
| :------------------- | :------ | :------------------------------- |
| `Authorization`      | `Token` | **Required**. Admin Bearer Token |

| Body       | Type          | Description                     |
| :--------- | :------------ | :-----------------------------  |
| `nama`     | `string`      | **Required**. Products nama     |
| `harga`    | `string`      | **Required**. Products harga    |
| `kategori` | `string`      | **Required**. Products kategori |
| `stock`    | `string`      | **Required**. Products stock    |
| `img`      | `file image`  | **optional**. Products img      |

#### Delete Products

```http
  DELETE /products/${id}
```

| Header               | Type    | Description                      |
| :------------------- | :------ | :------------------------------- |
| `Authorization`      | `Token` | **Required**. Admin Bearer Token |

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `id`      | `string` | **Required**. Id of Products to fetch |


## Transaction API Reference

#### Get Transaction

```http
  GET /txs/
```

| Header               | Type    | Description                      |
| :------------------- | :------ | :------------------------------- |
| `Authorization`      | `Token` | **Required**. Bearer Token       |

#### Get Transaction By Id

```http
  GET /txs/${id}
```

| Header               | Type    | Description                      |
| :------------------- | :------ | :------------------------------- |
| `Authorization`      | `Token` | **Required**. Bearer Token       |

| Parameter | Type    | Description                             |
| :-------- | :------- | :------------------------------------- |
| `id`      | `string` | **Required**. id for fetching Transaction |

#### Add Transaction

```http
  POST /txs/
```

| Header               | Type    | Description                      |
| :------------------- | :------ | :------------------------------- |
| `Authorization`      | `Token` | **Required**. Bearer Token       |

| Body          | Type          | Description                           |
| :------------ | :------------ | :-----------------------------------  |
| `user_id`     | `int`         | **Required**. Transaction user_id     |
| `items`       | `array`       | **Required**. Transaction items       |
| `final_price` | `string`      | **Required**. Transaction final_price |

| items array Body | Type          | Description                            |
| :--------------- | :------------ | :------------------------------------  |
| `product_name `  | `string`      | **Required**. Transaction product_name |
| `price`          | `int`         | **Required**. Transaction price        |
| `quantity`       | `int`         | **Required**. Transaction quantity     |
| `total_price`    | `int`         | **Required**. Transaction total_price  |


#### Edit Transaction 

```http
  PUT /txs/${id}
```

| Header               | Type    | Description                      |
| :------------------- | :------ | :------------------------------- |
| `Authorization`      | `Token` | **Required**. Admin Bearer Token |

| Body            | Type          | Description                       |
| :-------------- | :------------ | :-------------------------------  |
| `status_id`     | `int`         | **Required**. Transaction status  |

#### Delete Transaction

```http
  DELETE /txs/${id}
```

| Header               | Type    | Description                      |
| :------------------- | :------ | :------------------------------- |
| `Authorization`      | `Token` | **Required**. Admin Bearer Token |

| Parameter | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `id`      | `string` | **Required**. Id of Transaction to fetch |

## Cart API Reference

#### Get Cart

```http
  GET /cart/
```

| Header               | Type    | Description                      |
| :------------------- | :------ | :------------------------------- |
| `Authorization`      | `Token` | **Required**. Bearer Token       |

#### Add Cart

```http
  POST /cart/
```

| Header               | Type    | Description                      |
| :------------------- | :------ | :------------------------------- |
| `Authorization`      | `Token` | **Required**. Bearer Token       |

| Body          | Type          | Description                           |
| :------------ | :------------ | :-----------------------------------  |
| `id_barang`   | `int`         | **Required**. Cart id_barang          |
| `quantity`    | `array`       | **Required**. Cart quantity           |
| `price`       | `string`      | **Required**. Cart price              |

#### Delete Cart

```http
  DELETE /cart/${id}
```

| Header               | Type    | Description                |
| :------------------- | :------ | :------------------------- |
| `Authorization`      | `Token` | **Required**. Bearer Token |

| Parameter | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `id`      | `string` | **Required**. Id of Cart to fetch |

## Service API Reference

#### Get Service By User

```http
  GET /services/user
```

| Header               | Type    | Description                      |
| :------------------- | :------ | :------------------------------- |
| `Authorization`      | `Token` | **Required**. Users Bearer Token |

#### Get All Service

```http
  GET /services/admin
```

| Header               | Type    | Description                      |
| :------------------- | :------ | :------------------------------- |
| `Authorization`      | `Token` | **Required**. Admin Bearer Token |

#### Get Service By Technician

```http
  GET /services/technician
```

| Header               | Type    | Description                            |
| :------------------- | :------ | :------------------------------------- |
| `Authorization`      | `Token` | **Required**. Technician Bearer Token  |

#### Get Service By Id

```http
  GET /services/${id}
```

| Header               | Type    | Description                            |
| :------------------- | :------ | :------------------------------------- |
| `Authorization`      | `Token` | **Required**. Admin Bearer Token       |

| Parameter | Type     | Description                            |
| :-------- | :------- | :------------------------------------- |
| `id`      | `string` | **Required**. id for fetching Service  |


#### Add Service

```http
  POST /services/
```

| Header               | Type    | Description                      |
| :------------------- | :------ | :------------------------------- |
| `Authorization`      | `Token` | **Required**. User Bearer Token  |

| Body          | Type          | Description                        |
| :------------ | :------------ | :--------------------------------  |
| `wa_user`     | `string`      | **Required**. Service wa_user      |
| `message1`    | `array`       | **Required**. Service message1     |


#### Admin Picking Technician for Service 

```http
  PUT /services/${id}
```

| Header               | Type    | Description                      |
| :------------------- | :------ | :------------------------------- |
| `Authorization`      | `Token` | **Required**. Admin Bearer Token |

| Body            | Type          | Description                       |
| :-------------- | :------------ | :----------------------------------  |
| `technician_id` | `int`         | **Required**. Service technician_id  |
| `status_id`     | `int`         | **Required**. Service status_id      |


#### Technician Replying in Service 

```http
  PUT /services/technician/${id}
```

| Header               | Type    | Description                      |
| :------------------- | :------ | :------------------------------- |
| `Authorization`      | `Token` | **Required**. Technician Bearer Token |

| Body            | Type          | Description                     |
| :-------------- | :------------ | :-----------------------------  |
| `message2`      | `string`      | **conditional**. Service message2  |
| `message3`      | `string`      | **conditional**. Service message3  |
| `status_id`     | `int`         | **conditional**. Service status_id |


#### Delete Service

```http
  DELETE /services/${id}
```

| Header               | Type    | Description                           |
| :------------------- | :------ | :------------------------------------ |
| `Authorization`      | `Token` | **Required**. SuperAdmin Bearer Token |

| Parameter | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `id`      | `string` | **Required**. Id of Service to fetch     |


## Images API Reference

#### Get Images

```http
  GET /images/${filename}
```

| Parameter       | Type     | Description                   |
| :-------------- | :------- | :---------------------------- |
| `filename`      | `string` | **Required**. images filename |