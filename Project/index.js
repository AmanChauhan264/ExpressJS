const express = require("express");
const users = require("./MOCK_DATA.json")
const fs = require("fs");

const app = express();
const PORT = 8000;

// Middleware - plugin
app.use(express.urlencoded({extended: false})); 

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
       return res.json({status: "pending"});
   });
});

app.patch("/api/users/:id", (req, res)=>{
    // update new user with id
    return res.json({status: "pending"});
})

app.delete("/api/users/:id", (req, res)=>{
    // delete the user with id
    return res.json({status: "pending"});
})

app.listen(PORT, () => console.log(`Server started at port:${PORT}`));