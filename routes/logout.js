const cookie = require("cookie")

exports.logout = async (req, res) => {
        const options = {
            secure: process.env.NODE_ENV !== "development",
            httpOnly: true,
            sameSite: "strict",
            path: "/",
            maxAge: 60
          };
        res.setHeader(
            "set-cookie",
            cookie.serialize("lifebook_auth_token", "esuys.sljfslfj.slkfjlskdfjlksfj", options)
          );
        res.end()
}