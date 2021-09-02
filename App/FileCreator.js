const readline = require('readline');
const fs =  require('fs')
const path = require('path')


function creator(){

    const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
    });

    rl.question('File path ? ', (answer) => {
    // answer :-> model/auth_model.js || model.auth.js 
    
    let path_ = []

    for (const itr of answer) {

        if(itr === '/' ){

            path_ = answer.split('/')
        }

    }

    // check if dir exixt
    const r_path = path.join('App', path_[0])

    if( fs.existsSync( r_path ) ){

        fs.writeFileSync(`${r_path}/${path_[1]}`, `//filename=>${path_[1]}`)

        console.log(`File created in the existing dir : ${answer}`);
        return rl.close()
    }

    fs.mkdirSync(`${path_[0]}`, 0o776)
    
    fs.writeFileSync(`${r_path}/${path_[1]}`, `//filename=>${path_[1]}`)

    console.log(`File created in the new dir : ${answer}`);

    //fs.writeFileSync(`${answer}`, `//filename=>${answer}`)

    //console.log(`Thank you for your valuable feedback: ${answer}`);

    return rl.close();

    });

}

creator()


