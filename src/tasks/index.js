import express from "express"
const router = express.Router()
import { User, Task } from '../utils/database.js';
import { Op } from "sequelize";

router.get('/',async (req, res) => {
  const { search = '' } = req.query || {};
  const user = req.session.user;
  if (!user) {
    res.redirect('/user/signin');
    return;
  }
  const tasks = await Task.findAll({
    where: {
      UserId: user.id,
      title: {
        [Op.like]: `%${search}%`
      }
    },
    order: [
      ['completed', 'ASC'],
      ['updatedAt', 'DESC']
    ]
  });
  res.render('tasks', { tasks, search });
})

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(500).send({ message: '名称不能为空' });
    return;
  }
  const user = req.session.user;
  if (!user) {
    res.redirect('/user/signin');
    return;
  }

  const task = await Task.create({ 
    title: name,
    UserId: user.id
  });
  
  res.redirect('/tasks');
})

// 更新任务完成状态（PUT 请求）
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const completed = req.body.completed === "on"; // checkbox 选中时值为 'on'

  const task = await Task.findByPk(id);
  if (!task) return res.status(404).send({ message: "任务不存在" });

  task.completed = completed;
  await task.save();
  res.redirect("/tasks");
});

// 删除任务（DELETE 请求）
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByPk(id);
  if (!task) return res.status(404).send({ message: "任务不存在" });

  await task.destroy();
  res.redirect("/tasks");
});

export default router