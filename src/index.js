import express from "express"
// import cookieParser from "cookie-parser";
import process from 'node:process';
import session from 'express-session';
import methodOverride from "method-override";

import user from './user/index.js'
import api from './api/index.js'
import tasks from './tasks/index.js'
import { dirJoin } from "./utils/index.js";
import { compileSass } from "./utils/sass.js";
import logger from 'morgan';
import { sequelize, authenticateAndSync } from './utils/database.js';
import debugModule from "debug"
const debug = debugModule('express:server')

const app = express()
const port = 3000

app.set('views', dirJoin('src/views'))
app.set('view engine', 'pug')
app.use(logger('dev'));
app.use(express.static(dirJoin('public')))
app.use(express.json("application/json"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // 解析 `?_method`
// app.use(cookieParser());

// 配置 express-session 中间件
app.use(
  session({
    secret: 'my_session_secret_key', // 用于加密 Session ID 的密钥
    resave: false,                  // 是否每次请求都重新保存 Session
    saveUninitialized: false,       // 是否为未初始化的 Session 分配存储
    cookie: {
      httpOnly: true,               // 防止 XSS 攻击
      secure: false,                // 本地开发时关闭，生产环境启用 HTTPS 时设置为 true
      maxAge: 60 * 60 * 1000,       // 设置 Session 有效期 (1 小时)
    },
  })
);

// 监听 SCSS 文件变化，编译整个 sass 目录
compileSass();

// 日志中间件
app.use((req, res, next) => {
  debug(req.url);
  next()
})

// 验证中间件
app.use((req, res, next) => {
  if (req.session.user) {
    if (req.url === '/user/signin' || req.url === '/user/signup') {
      res.redirect('/tasks');
    } else {
      next();
    }    
  } else {
    if (req.url === '/user/signin' || req.url === '/user/signup') {
      next();
    } else {
      res.redirect('/user/signin');
    }
  }
});

app.get('/', (req, res) => {
  res.redirect('/tasks')
})
app.use('/user', user)
app.use('/api', api)
app.use('/tasks', tasks)

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("哦，出错了")
})

await authenticateAndSync();

app.listen(port, () => {
  debug(`Example app listening on port ${port}`)
})

process.on('exit', (code) => {
  console.log(`Node.js 进程退出，退出码：${code}`);
  sequelize.close();
});

process.on('SIGINT', () => {
  console.log('接收到 SIGINT 信号，进程即将终止');
  sequelize.close();
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('接收到 SIGTERM 信号，进程即将终止');
  sequelize.close();
  process.exit();
});