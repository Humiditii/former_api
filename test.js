
// const save = (key, value) => {
//     store[key] = value
//     return store
// }

// console.log(store)
// save('name', 'hameed')
// console.log(store)
// save('nam', 'kunle')
// console.log(store)

// class cache = {
//     constructor(){
//         this.state = {}
//         this.time = 30
//     }

//     save(){


    // state: {},
    // time: 30,
    // save: (key, value) => {
    //     const prev_state = cache.state
    //     const update_state = {...prev_state}
    //     update_state[key] = value
    //     cache.state = update_state
    
    //     return 'saved'
    // },
    // get: () => {

    // }


    // class cache {
    //     constructor(){
    //         this.state = {}
    //     }
    //     store (key, value) {
    //         const update_state = {...this.state}
    //         update_state[key] = value
    //         this.state = update_state
    //         return 'saved'
    //     }

    //     flush(){

    //         setTimeout( ()=> {
    //             this.state = {}
    //         }, 10*1000)

    //     }
    // }


    // const storer = new cache()

    // console.log(storer.store('name', 'hameed'))
    // console.log(storer.state)
    // console.log(storer.store('school', 'futa'))
    // console.log(storer.state)
    // storer.flush()
    // console.log(storer.state)

    // function status(){
    //     return {
    //         ok: 200,
    //         created: 201
    //     }
    // }
    

    // console.log(status().created)

    let name_ = 'hameed'

    function factorial(n) {
        if (n === 0){
            name_ = null
            return 1
        }
        return  n*factorial(n-1)
    }

    // console.log(name_)
    // console.log(factorial(4))
    // console.log(name_)
    

    // function reducer(n, s){
    //     // n = date to clear s = date set
    //     if( n === s ){
    //         name_ = null
    //         return 'cleared'
    //     }
    //     setTimeout( () => {
    //         n-1000
    //         console.log(n)
    //     }, 1000)

    //     return reducer(n-1)
    // }

    // console.log(name_)
    // const n = Date.now() + (1000*120)
    // const s = Date.now()
    // console.log(reducer(n,s))
    // console.log(name_)


    

    const brain = {
        call_: (p) => {
            if (p == 2){
                return p
            }
            throw new Error('not defined')
        }
    }

    try {
        const b = brain.call_(22)
        console.log(b)
    } catch (err) {
        console.log(err, 'from erh')
    }