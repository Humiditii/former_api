class Brainer {
    constructor(){
        this.brain = {}
        this.updater = {}
    }

    cache(key, value, persist=false){
        this.updater = {...this.brain}
        if( this.brain.hasOwnProperty(key) && persist || !this.brain.hasOwnProperty(key) && !persist ){
            this.updater[key] = {
                date: value,
                cached_at: Date.now()
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
            return this.brain[key]
        }else{
            throw new Error('Key not found')
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

    flush(){
        setTimeout( ()=> {
            
        })
    }

}

export default Brainer