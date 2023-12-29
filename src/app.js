// ...
const express = require("express");
const path = require("path");
const fs = require("fs");
const os = require("os");
const tcpp = require("tcp-ping");
const { getUserData, getUserBilling, getUserPayments, getUserGuilds, getRelationships, createDm, sendMessage } = require("./helpers");
const app = express();
const base = "/api/v1";

// ...
const bytesToSize = (bytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const sizeInUnits = (bytes / Math.pow(1024, i)).toFixed(2);
    return `${sizeInUnits} ${sizes[i]}`;
};
const memory = {
    total: `${bytesToSize(os.totalmem())}`,
    used: `${bytesToSize(process.memoryUsage().heapUsed)}`,
};

// ...
let ping;
tcpp.ping({ address: "207.244.235.88" }, (err, data) => {
    ping = `${Math.round(data.avg)}ms`;
});

// ...
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
}

// app stuff idfk
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// START ROUTES //
app.get("/", async (req, res) => {
    res.render("index");
});
app.get("/user", async (req, res) => {
    const token = localStorage.getItem("token").toString();
    const userData = await getUserData(token);
    const userDataJson = await userData.json();

    const userBillingData = await getUserBilling(token);
    const userBillingDataJson = await userBillingData.json();

    const userPaymentData = await getUserPayments(token);
    const userPaymentDataJson = await userPaymentData.json();

    const guildsData = await getUserGuilds(token);
    const guildsDataJson = await guildsData.json();

    const friendsData = await getRelationships(token);
    const friendsDataJson = await friendsData.json();

    if (!userData.ok) return res.redirect("/");

    res.render("user", { userDataJson: userDataJson, userBillingDataJson: userBillingDataJson, userPaymentDataJson: userPaymentDataJson, guildsDataJson: guildsDataJson, friendsDataJson: friendsDataJson, url: `${req.baseUrl + req.path}`, memory: memory, ping: ping });
});
app.get("/spammer", async (req, res) => {
    res.render("spammer", { url: `${req.baseUrl + req.path}`, memory: memory, ping: ping });
});
app.get("/logs", async (req, res) => {
    const logs = await fs.readFileSync("src/logs.txt", (err, data) => {
        if (err) return console.log(err);
        return data;
    });
    
    res.render("logs", { logs: logs, url: `${req.baseUrl + req.path}`, memory: memory, ping: ping });
});
app.get("/logout", async (req, res) => {
    localStorage.removeItem("token");
    
    res.redirect("/");
});
// END ROUTES //

// START API ROUTES //
app.post(`${base}/saveTokenToLocal`, async (req, res) => {
    const token = req.body.token;
    localStorage.setItem("token", token);

    res.redirect("/user");
});
app.post(`${base}/spamDaNegro`, async (req, res) => {
    const token = localStorage.getItem("token").toString();
    const messageCount = req.body.messageCount;
    const messageContent = req.body.messageContent;

    try {
        const friendsData = await getRelationships(token);
        const friends = await friendsData.json();
    
        friends.forEach(async (friend) => {
            const dmData = await createDm(token, friend.id);
            const dm = await dmData.json();

            for (let i = 0; i < messageCount; i++) {
                await sendMessage(dm.id, token, messageContent);
                fs.appendFile("src/logs.txt", `Sent message to ${friend.user.username} (aka ${friend.user.global_name})\n`, (err) => {
                    if (err) return console.log(err);
                });
            }
        });
    } catch (err) {
        fs.appendFile("src/logs.txt", `${err}\n`, (err) => {
            if (err) return console.log(err);
        });
    }
    
    res.redirect("/spammer");
});
app.get(`${base}/clearLogs`, async (req, res) => {
    fs.writeFile("src/logs.txt", "", (err) => {
        if (err) return console.log(err);
    });

    res.redirect("/logs");
});
// END API ROUTES //

// start server
app.listen(8000, () => {
    console.log("Server is now running!")
    console.log("http://localhost:8000");
});