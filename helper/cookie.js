const setAccessToken = (res, accessToken) => {
    res.cookie("accessToken", accessToken, {
        maxAge: 5 * 60 * 1000, // 5 minute
        httpOnly: true,
        // secure: true,
        sameSite: "none"
    })
};

const setRefreshToken = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        // secure: true,
        sameSite: "none"
    })
};


module.exports = {setAccessToken, setRefreshToken}