const jwt = require('jsonwebtoken');
module.exports = (req,res,next)=>{
    const token = req.body.token;

    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
            if(err)
                {
                    
                    req.flash('danger','Iltimos Ro`yxatchadan o`ting');
                    res.redirect('/logout');   
                    
                }
            else{
                req.decode = decoded;
                next();
            }    
        })
    }
    else{
        req.flash('danger','Iltimos ro`yxatdan o`ting');
        res.redirect('/logout'); 
    }
}