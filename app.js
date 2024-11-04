const express = require("express");
const app = express();
const cors = require("cors");
const prisma = require("./prismaClient");

app.use(cors());
app.use(express.json());

// Route to get all employees
app.get("/employees", async (req, res) => {
  const employees = await prisma.employee.findMany({
    include: { taskCounts: true },
  });
  const data = employees.map((item) => {
    return {
      id: item.id,
      firstName: item.firstName,
      email: item.email,
      password: item.password,
      taskCounts: item.taskCounts,
    };
  });

  res.json(data);
});

app.get("/tasks", async (req, res) => {
  const id = req.query.id;
  const tasks = await prisma.task.findMany({
    where: {
      employeeId: id,
    },
  });
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const { email, taskTitle, taskDescription, taskDate, category } = req.body;
  try {
    const employee = await prisma.employee.findFirst({
      where: {
        email: email,
      },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const newTask = await prisma.task.create({
      data: {
        taskTitle,
        taskDescription,
        taskDate: new Date(taskDate),
        category,
        active: true,
        newTask: true,
        completed: false,
        failed: false,
        employeeId: employee.id,
      },
    });

    res.status(201).json(newTask);
  } catch (e) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the task" });
  }
});

// Route to add a new employee
app.post("/employees", async (req, res) => {
  //const { firstName, email, password } = req.body;
  //const newEmployee = await prisma.employee.create({
  //  data: {
  //    firstName,
  //    email,
  //    password,
  //    taskCounts: {
  //      create: { active: 0, newTask: 0, completed: 0, failed: 0 },
  //    },
  //  },
  //});

  const userData = await prisma.employee.findMany();

  res.json(newEmployee);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
