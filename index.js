// implement your API here
const express = require("express");
const db = require("./data/db.js");

const server = express();



server.use(express.json());
server.get("/", (req, res) => {
    res.send("I'm Pickle Rick!")
})

server.listen(4001, () => {
    console.log("server listening on port 4001");
});

server.post("/api/users", (req, res) => {
    const userInfo = req.body;
    console.log(userInfo);
    if (!userInfo.name || !userInfo.bio) {
        return res.status(400).json({
            success: false,
            message: { errorMessage: "Please provide name and bio for the user." }
        })
    }


    db.insert(userInfo)
        .then((user) => {
            if (user.id) {
                db.findById(user.id)
                    .then(user => {
                        res.status(201).json({ success: true, user })
                    })
            }
            else {
                res.status(500).json({ success: false, message: "database couldnt grab id" })

            }

        })
        .catch((err) => {
            res.status(500).json({ success: false, message: err.message })

        })
})

server.get("/api/users", (req, res) => {
    db.find()
        .then(users => {
            res.status(201).json(users);
        })
        .catch((err) => {
            res.status(500).json({
                err: err.message,
                errorMessage: "The users information could not be retrieved",
                success: false
            });
        });
});

server.get("/api/users/:id", (req, res) => {
    const { id } = req.params;
    db.findById(id)
        .then(user => {
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(500).json({
                    message: "The user with the specified ID does not exist.",
                    success: false
                })
            }

        })
        .catch((err) => {
            res.status(500).json({ success: false, message: err.message })
        })

})

server.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Bitch go back and get an ID" })
    }

    db.remove(id)
        .then(deletedUser => {
            if (deletedUser) {
                res.status(202).json({ success: true })
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })

        .catch(err => {
            res.status(500).json({ success: false, err, error: "The user could not be removed" })
        });
})

server.put("/api/users/:id", (req, res) => {
    const { name, bio } = req.body

    if (!name || !bio) {
        res.status(400).json({
            errormessage: "Please provide name and bio for the user"
        })
    } else {
        db.update(req.params.id, req.body)
            .then(user => {
                if (user) {
                    res.status(200).json(user)
                } else {
                    res.status(404).json({
                        message: "The user with the specificed ID does not exist"
                    })
                }
            })

            .catch(() => {
                res.status(500).json({ errorMessage: "The user info could not be modified" })
            })
    }
})

