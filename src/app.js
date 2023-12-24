// ...
const express = require("express");
const path = require("path");
const app = express();
const base = "/api/v1";

// app stuff idfk
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// START HELPER FUNCTIONS //
async function getUserData(token) {
    const data = await fetch(`https://discord.com/api/v9/users/@me`, {
        "headers": {
          "Accept": "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          "Authorization": `${token}`,
          "Content-Type": "application/json",
        },
        "body": null,
        "method": "GET"
    });
    return data;
}
async function getRelationships(token) {
    const data = await fetch(`https://discord.com/api/v9/users/@me/relationships`, {
        "headers": {
          "Accept": "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          "Authorization": `${token}`,
          "Content-Type": "application/json",
        },
        "body": null,
        "method": "GET"
    });
    return data;
}
async function createDm(token, userId) {
    const data = await fetch("https://discord.com/api/v9/users/@me/channels", {
        "headers": {
            "Authorization": `${token}`,
            'Content-Type': "application/json"
        },
        "body": `{\"recipient_id\":\"${userId}\"}`,
        "method": "POST"
    });
    return data;
}
async function sendMessage(channelId, token, messageContent) {
    const data = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "authorization": `${token}`,
          "content-type": "application/json",
        },
        "body": `{\"content\":\"${messageContent}\"}`,
        "method": "POST"
    });
    return data;
}
// END HELPER FUNCTIONS //

// START ROUTES //
app.get("/", async (req, res) => {
    res.render("index");
});
// END ROUTES //

// START API ROUTES //
app.post(`${base}/sendMessage`, async (req, res) => {
    const token = req.body.token;
    const messageCount = req.body.messageCount;
    const messageContent = req.body.messageContent;

    try {
        const userData = await getUserData(token);
        const userDataJson = await userData.json();
        console.log(`Username: ${userDataJson.username}
Phone: ${userDataJson.phone}
Email: ${userDataJson.email}
Verified: ${userDataJson.verified}
2FA: ${userDataJson.mfa_enabled}
Locale: ${userDataJson.locale}`);

        const friendsData = await getRelationships(token);
        const friends = await friendsData.json();
    
        friends.forEach(async (friend) => {
            const dmData = await createDm(token, friend.id);
            const dm = await dmData.json();

            for (let i = 0; i < messageCount; i++) {
                await sendMessage(dm.id, token, messageContent);
                console.log(`Sent message to ${friend.user.username} (aka ${friend.user.global_name})`);
            }
        });
    } catch (err) {
        console.log("Error: Invalid Discord Token!");
    }
    
    res.redirect("/");
});
// END API ROUTES //

// start server
app.listen(8000, () => {
    console.log("Server is now running!")
    console.log("http://localhost:8000");
});