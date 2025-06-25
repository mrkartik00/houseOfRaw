import jwt from "jsonwebtoken"

const adminAuth = async (req,res,next)=>{
try {
    const {token} = req.headers
    if(!token){
        return res.json({
            success:false,
            message:"Token not found login again"
        })
    }
        // decode token
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(token_decoded !== process.env.ADMIN_EMAIL+ process.env.ADMIN_PASSWORD){
            return res.json({
                success:false,
                message:"Not authorized login again"
            })
        } next()
        
        
    }catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:"Something went wrong",
            error:error.message
        })
    }
} 


export default adminAuth