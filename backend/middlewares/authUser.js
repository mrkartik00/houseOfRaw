import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
 const { token } = req.headers;
    if (!token) {
            return res.json({
                success: false,
                message: "Token not found, please log in again."
            });
        }
    try {
        // Decode token
        const token_decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.body.userId = token_decoded.id;
        next();

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Invalid token, please log in again."
        });
    }
}

export default authUser;