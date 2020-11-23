require('dotenv').config();

module.exports = async function() {
    const access_token_secret = await process.env.ACCESS_TOKEN_SECRET;
    const refresh_token_secret = await process.env.REFRESH_TOKEN_SECRET;

    if( (!access_token_secret) || (!refresh_token_secret)){
        console.log("FATAL Error: JWT Keys are not set");
        throw new Error("FATAL Error: JWT Keys are not set");
        // process.exit(1);
    }
}