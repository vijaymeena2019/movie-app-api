// Authorization

export function admin (req, res, next) {
    // run after authorizetion // req.user
    // 401 Unauthorize
    // 403 Forbidden
    if(!req.user.isAdmin) return res.status(403).send(`Access denied`)
    
    next();
}