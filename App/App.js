import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';


const app = express()


app.use(bodyParser.urlencoded({
    extended: false
}));

// application/json parsing json incoming request

app.use(bodyParser.json());

//allowing CORS
app.use(cors());

// app routes injection goes here --->>>>

//routes ends here
app.use('/', (req, res)=> {
    res.status(200).json({
        statusCode: 200,
        message: 'Welcome to the entry point to the api'
    })
} )


app.all( '*',(req, res, next)=> {
    return res.status(404).json({
        statusCode: 404,
        message: 'Not found, invalid route'
    });
})
//Handling errors 


app.use((error, req, res, next) => {
    //console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).json({
        message: message,
        statusCode: status
    });
});



export default app