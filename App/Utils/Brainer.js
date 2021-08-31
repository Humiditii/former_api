class Brainer {

    constructor(){
        this.brain = {}
        this.updater = {}
    }

    cache(key, value, time = 'not_set', persist=false){

        this.updater = {...this.brain}

        if( this.brain.hasOwnProperty(key) && persist || !this.brain.hasOwnProperty(key) && !persist ){

            this.updater[key] = {
                data: value,
                cached_at: Date.now(),      
                hold_for: time
            }

            this.brain = this.updater

            if( time !== 'not_set' ){
                this.flush(this.updater[key].hold_for, key)
            }

            this.updater = {}

            return 'cached'

        }else{

            throw new Error('Error in caching, key does\'n exist or key exist but persist set to false ')
        }
    }

    recall(key){

        if(this.brain.hasOwnProperty(key)){

            // if( Date.now() > (this.brain[key].cached_at + this.brain[key].hold_for)){

            //     this.brain[key] = null
            //     delete this.brain[key]

            //     return 'wipped'
            // }

            return { 

                neuron : this.brain[key],
                found: true
            }

        }else{
            return {

                msg: 'Key not found',
                found: false
            }
        }
    }

    forget(key){

        if(this.brain.hasOwnProperty(key)){

            this.brain[key] = null

            delete this.brain[key]

            return `${key} deleted`

        }else{

            throw new Error('Key not found')
        }
    }

    flush(time, key){

        setTimeout( ()=>{

            this.brain[key] = null
            delete this.brain[key]

        }, time*1000)

    }


}

export default Brainer