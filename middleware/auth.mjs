// Authentication // Used to post, put , delete data

import jwt from 'jsonwebtoken';
import config from 'config';


export function auth(req, res, next) {

    const token = req.header('x-auth-token');
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
    // const token = req.header("x-auth-token");
    // if (!token) return res.status(401).send(`Access denied. NO token provided`);
    // console.log(jwt.verify(token, config.get('jwtPrivateKey')));
    // try {
    //     console.log('hello');
       
    //     const decoded = jwt.verify(token, config.get('jwtPrivateKey')) // 1st token, 2nd private key
    //     req.user = decoded;
    //     console.log(req.user);
    //     next();
    // }
    // catch (ex) {
    //     res.status(400).send(`Invalid Token.`)
    // }
    
}

