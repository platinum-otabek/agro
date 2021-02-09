function eA(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash('danger','Siz ro`yxatdan o`tmagansiz');
        res.redirect('/login');
    }
}


function eAdmin(req,res,next){
    if(req.isAuthenticated()){
        if(req.user.status == 'admin'){
            next();
        }
        else{
            req.flash('danger','Faqatgina filial admini o`zgartirishi mumkin');
            res.redirect('/commerce/show'); 
        }
    }else{
        req.flash('danger','Iltimos ro`yxatdan o`ting');
        res.redirect('/logout');
    }
  }
function eS(req,res,next){
    if(req.isAuthenticated()){
        if(req.user.status == 'super' || req.user.status == 'king'){
            next();
        }
        else{
            req.flash('danger','Huquqingiz yetarli emas');
            res.redirect('/logout'); 
        }
    }else{
        req.flash('danger','Iltimos ro`yxatdan o`ting');
        res.redirect('/logout');
    }
  }
  function eK(req,res,next){
    if(req.isAuthenticated()){
        if(req.user.status == 'king'){
            next();
        }
        else{
            req.flash('danger','Huquqingiz yetarli emas');
            res.redirect('/logout'); 
        }    
    }else{
        req.flash('danger','Iltimos ro`yxatdan o`ting');
        res.redirect('/logout');
    }
  }
module.exports.eA = eA;
module.exports.eS = eS;
module.exports.eK = eK;
module.exports.eAdmin = eAdmin;