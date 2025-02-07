import express from "express"
const router = express.Router()
import { User } from '../utils/database.js';

router.get('/signup', (req, res) => {
  res.render('sign-up')
})

router.get('/signin', (req, res) => {
  res.render('sign-in')
})

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    const error = !username ? "请填写用户名" : (!email ? "请填写邮箱" : "请填写密码");
    res.status(500).render('sign-up', { error: error, ...req.body });
    return;
  }
  if (password.length < 6) {
    res.status(500).render('sign-up', { error: "密码至少6位", ...req.body });
    return;
  }
  let user = await User.findOne({
    where: {
      username
    }
  });
  if (user) {
    res.status(500).render('sign-up', { error: "用户名已存在", ...req.body });
    return;
  } else {
    user = await User.findOne({
      where: {
        email
      }
    })
    if (user) {
      res.status(500).render('sign-up', { error: "邮箱已存在", ...req.body });
      return;
    } else {
      const newUser = await User.create({
        username,
        email,
        password
      });
      res.redirect('/user/signin');
      return;
    } 
  }
})

router.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    const error = !username ? "请填写用户名" : "请填写密码";
    res.status(500).render('sign-in', { error: error, ...req.body });
    return;
  }
  const user = await User.findOne({
    where: {
      username,
      password
    }
  });
  if (user) {
    req.session.user = user;
    res.redirect('/');
    return;
  } else {
    res.status(500).render('sign-in', { error: "用户名或密码错误", ...req.body });
    return;
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ message: '退出失败' });
    }

    res.clearCookie('connect.sid'); // 清除 Session Cookie
    res.status(200).send({ message: '退出成功' });
  });
})


export default router