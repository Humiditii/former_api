class Brainer {

    constructor(){
        this.brain = {}
        this.updater = {}
    }

    cache(key, value, time, persist=false){

        this.updater = {...this.brain}

        if( this.brain.hasOwnProperty(key) && persist || !this.brain.hasOwnProperty(key) && !persist ){

            this.updater[key] = {
                data: value,
                cached_at: Date.now(),
                hold_for: time
            }

            this.brain = this.updater
            this.updater = {}

            return 'cached'

        }else{

            throw new Error('Error in caching, key does\'n exist or key exist but persist set to false ')
        }
    }

    recall(key){

        if(this.brain.hasOwnProperty(key)){
            if( this.brain[key].cached_at * this.brain[key].hold_for <  Date.now() ){

                this.brain[key] = null
                delete this.brain[key]
            }

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


}

export default Brainer