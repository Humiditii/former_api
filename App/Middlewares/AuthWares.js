import jwt from 'jsonwebtoken';

class Authwares {
    static async checkAuthentication(req, res, next){
        const authHeader = req.get('Authorization') || req.headers['x-access-token'] || req.headers['Authorization'];

        if (!authHeader) {
            
            const error = new Error('Not Authorized');
            error.statusCode = 401;
            throw error;
        }
        const token = authHeader.split(' ')[1];
        let decodedToken; 

        try {
            decodedToken = jwt.verify(token, process.env.SECRET);
        } catch (err) {
            err.statusCode = 500;
            return next (err);
        }
        if (!decodedToken) {

            const error = new Error('Not Authenticated');
            error.statusCode = 401;
            throw error;
        }
    
        req.userId = decodedToken.userId;
        req.role = decodedToken.access_type

        next();
    }

    static superAdminAccess(req, res, next){
        if(req.role !== 'Super-Admin'){
            const error = new Error('Permission denied');
            error.statusCode = 401 
            throw error
        }else{
            next()
        }
        
    }

    static userAccess(req, res, next){
        if(req.role !== 'sudo_0'){
            const error = new Error('Permission denied');
            error.statusCode = 401 
            throw error
        }else{
            next()
        }
    }
}


export default Authwares;