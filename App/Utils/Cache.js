const Cacher = {
    // Holds all cached data
    container: {},

    CACHE_DURATION: 3*60*1000, // 3 min

    // cache data pattern --->[ key -> value ]
    cache: (value, key, persist=false) => {
        const updated_container = {...Cacher.container}
        // check if the key is present, if present and persist is true, then force it to update the key's value, but if persist is false then reject it by throwing error
        if(updated_container.hasOwnProperty(key)){
            if(!persist){
                throw new Error(` key ${key} present and not allowed to be updated, change persist param to true to overwrite the value`)
            }else{
                updated_container[key] = {
                    data: value,
                    cached_at: Date.now()
                }
            }
        }
          
    },

    // delete data
    flush: (key) => {

    },

    // get cached data
    recall: (key) => {

    },

    // update a cached data
    update: (key) => {

    }

}


export default Cacher