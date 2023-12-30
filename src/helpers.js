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
async function getUserSessions(token) {
    const data = await fetch(`https://discord.com/api/v9/auth/sessions`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": `${token}`,
            "content-type": "application/json",
            "x-super-properties": "eyJvcyI6IkxpbnV4IiwiYnJvd3NlciI6IkNocm9tZSIsImRldmljZSI6IiIsInN5c3RlbV9sb2NhbGUiOiJlbi1VUyIsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyMC4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTIwLjAuMC4wIiwib3NfdmVyc2lvbiI6IiIsInJlZmVycmVyIjoiIiwicmVmZXJyaW5nX2RvbWFpbiI6IiIsInJlZmVycmVyX2N1cnJlbnQiOiIiLCJyZWZlcnJpbmdfZG9tYWluX2N1cnJlbnQiOiIiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjoyNTYyMzEsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGwsImRlc2lnbl9pZCI6MH0=",
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
async function getUserPayments(token) {
    const data = await fetch(`https://discord.com/api/v9/users/@me/billing/payments`, {
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
            "Content-Type": "application/json"
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
async function patchSettings(token, encodedData) {
    const data = await fetch(`https://discord.com/api/v9/users/@me/settings-proto/1`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": `${token}`,
            "content-type": "application/json",
            "x-super-properties": "eyJvcyI6IkxpbnV4IiwiYnJvd3NlciI6IkNocm9tZSIsImRldmljZSI6IiIsInN5c3RlbV9sb2NhbGUiOiJlbi1VUyIsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyMC4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTIwLjAuMC4wIiwib3NfdmVyc2lvbiI6IiIsInJlZmVycmVyIjoiIiwicmVmZXJyaW5nX2RvbWFpbiI6IiIsInJlZmVycmVyX2N1cnJlbnQiOiIiLCJyZWZlcnJpbmdfZG9tYWluX2N1cnJlbnQiOiIiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjoyNTYyMzEsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGwsImRlc2lnbl9pZCI6MH0=",
        },
        "body": `{\"settings\":\"${encodedData}\"}`,
        "method": "PATCH"
    });
    return data;
}
// END HELPER FUNCTIONS //

module.exports.DiscordAPI = {
    getUserData,
    getUserSessions,
    getUserBilling,
    getUserPayments,
    getUserGuilds,
    getRelationships,
    createDm,
    sendMessage,
    patchSettings
}