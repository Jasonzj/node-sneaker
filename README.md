# Node-Sneaker

一个基于 Koa2, Typescript 构建的球鞋比价网 API service

![Build & Deploy](https://github.com/Jasonzj/node-sneaker/workflows/Build%20&%20Deploy/badge.svg)
[![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)](https://github.com/Jasonzj/node-sneaker/blob/main/LICENSE)
## API

[API 文档](https://documenter.getpostman.com/view/13196019/TVmMfxDF)

## 技术桟

- Koa2
- Typescript
- Axios
- Gulp
- MongoDB
## 安装
```shell
$ git clone https://github.com/Jasonzj/sneaker.git
$ yarn
```
## 配置文件&环境变量
项目配置文件位于server/config/env

### 环境变量说明

| 变量名 | 说明 |
| --- | --- |
| PORT | 端口号 |
| API_PREFIX | API前缀 |
| SEARCH_PAGE_LIMIT | 搜索数量限制 |
| CONCURRENT_LIMIT | 爬虫并发限制 |
| DEWU_PAGE_LIMIT | DEWU搜索接口数量限制 |
| DEWU_CONCURRENT_LIMIT | DEWU搜索接口并发限制 |
| REQUIRE_TIMEOUT | 请求超时时间/秒 |
| PROXY_PORT | 代理端口，设置后开启代理 |

### 隐私环境变量说明

| 变量名 | 说明 |
| --- | --- |
| MONGODB_LINK | mongodb连接地址, 使用docker-compose方式的话连接地址为service name(指定service name会自动创建network alias) |
| JWT_SECRET | jwt加密 |
| SALT_WORK_FACTOR | 密码加盐系数 |

新建variables.env, 该文件用来存放隐私环境变量
### variables.env demo
```shell
MONGODB_LINK=mongodb://localhost:XX  #使用docker-compose方式: mongodb://database(这里填service name):XX
JWT_SECRET=jwtsecret
SALT_WORK_FACTOR=9
```

## 运行
```shell
$ yarn start
```

## Docker容器运行
先创建~/data/db 用于存放mongodb数据库文件, 用于持久化数据(使用Bind Mounts方式)

再创建一个目录node-sneaker用于存放docker-compose配置和隐私环境变量
```shell
node-sneaker
├── variables.env
└── docker-compose.yml
```
### 启动
```shell
$ cd node-sneaker
$ docker-compose up -d #修改docker-compose.yml后需要使用此命令使更改生效
```


## 前端

[GitHub](https://github.com/Jasonzj/sneaker) | [在线地址](http://www.sneakerapp.tk/)

<img src="https://github.com/Jasonzj/sneaker/blob/main/screenshots/demo.gif" width=800 align=left>
