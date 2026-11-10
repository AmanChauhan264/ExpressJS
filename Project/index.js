const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json")

const app = express();
const PORT = 8000;

// Middleware - plugin
app.use(express.urlencoded({extended: false})); 

app.use((req, res, next)=>{
    next();
})

app.use(express.json())
app.get("/users", (req, res) =>{
    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`)}
    </ul>
    `
    res.send(html);
})

// Rest Api
app.get("/api/users", (req ,res) => {
    // custom header
    res.setHeader("X-MyName", "Piyush Garg"); // Always add x to custom headers
    return res.json(users);
})

app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
})

app.post("/api/users", (req, res)=>{
    // create new user
    const body = req.body;
    users.push({...body, id: users.length + 1});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) =>{
       return res.json({status: "success", id: users.length});
   });
});

app.patch("/api/users/:id", (req, res) => {
    // update existing user
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if (!user) {
        return res.status(404).json({ status: "User not found" });
    }
    Object.assign(user, req.body);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ status: "Error updating user" });
        }
        return res.json({ status: "success", user });
    });
});

app.delete("/api/users/:id", (req, res) => {
    // delete a user
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
        return res.status(404).json({ status: "User not found" });
    }
    users.splice(index, 1);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ status: "Error deleting user" });
        }
        return res.json({ status: "success", message: "User deleted" });
    });
});

app.listen(PORT, () => console.log(`Server started at port:${PORT}`));