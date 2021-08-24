// class store {
    
//     static big_store(){
//         return {}
//     }

//     static s (key,val){
//         const prev_s = this.big_store(this.big_store({}))
//         const updated_s = {...prev_s}
//         updated_s[key] = val
//         this.big_store(updated_s)
//         console.log(updated_s, prev_s, this.big_store(updated_s))
//         return 'saved'
//     }
// }

// const state = store
// console.log(state.big_store())
// console.log(state.s('engr', 'kunle'))
// console.log(state.s('name', 'hameed'))
// console.log(state.big_store())


const A = {
    b: 'hello',

    show: () => A.b
}


console.log(A.show())
// const store = {}

// const save = (key, value) => {
//     store[key] = value
//     return store
// }

// console.log(store)
// save('name', 'hameed')
// console.log(store)
// save('nam', 'kunle')
// console.log(store)

const cache = {
    state: {},
    time: 30,
    save: (key, value) => {
        const prev_state = cache.state
        const update_state = {...prev_state}
        update_state[key] = value
        cache.state = update_state
    
        return 'saved'
    },
    get: () => {

    }
}
cache.time = 100
console.log(cache.state)
console.log(cache.save('name', 'hameed'))
console.log(cache.state)
console.log(cache.save('bae', 'harleemah'))
console.log(cache.state)
console.log(cache)

