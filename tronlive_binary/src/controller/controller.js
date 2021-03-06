const service = require("../service/service");

const inWhileList = function (headers) {
    const cf_ip = headers['x-real-ip'] || ''
    const env = process.env.NODE_ENV
    if(env === 'production'){
        console.log("prd ip is ",cf_ip)
        const whileList = ['130.211.60.218']
        if(whileList.includes(cf_ip.trim())){
            return false
        }else {
            return true
        }
    }
    return false
}

class apiCall {

    static async identify(ctx) {
        console.log(`${new Date().toJSON()}-->check balance headers : `,ctx.request.headers)
        const isBlack = inWhileList(ctx.request.headers)
        console.log("isBlack ",isBlack)
        if(isBlack){
            ctx.status = 400;
            return ctx.body = "403 not found"
        }
        const params = ctx.request.body || {}
        const t  = await service.identify(params)
        if(t.code === 2){
            ctx.status = 400;
            ctx.body = t
        }else {
            ctx.body = t
        }
    }

    static async buy(ctx) {
        // ctx.status = 400
        // ctx.body = "error"
        const isBlack = inWhileList(ctx.request.headers)
        if(isBlack){
            ctx.status = 400;
            return ctx.body = "403 not found"
        }
        const body = ctx.request.body || {}
        const {tokenError, tokenInfo}  = await service.getToken(body)
        if (tokenError) {
            ctx.status = 400;
            return ctx.body = 'check with token!'
        }
        const t  = await service.buy(tokenInfo)
        if(t.code === 2){
            ctx.status = 400;
            ctx.body = t
        }else if(t.code === 3){
            ctx.status = 200;
            ctx.body = t.data
        }else {
            ctx.body = t
        }
    }


    static async close(ctx) {
        // ctx.status = 400
        // ctx.body = "error"
        const isBlack = inWhileList(ctx.request.headers)
        if(isBlack){
            ctx.status = 400;
            return ctx.body = "403 not found"
        }
        const body = ctx.request.body || {}
        const {tokenError, tokenInfo}  = await service.getToken(body)
        if (tokenError) {
            ctx.status = 400;
            return ctx.body = 'check with token!'
        }
        const t  = await service.close(tokenInfo)
        if(t.code === 2){
            ctx.status = 400;
            ctx.body = t
        }else if(t.code === 3){
            ctx.status = 200;
            ctx.body = t.data
        }else {
            ctx.body = t
        }
    }

    static async refund(ctx) {
        // ctx.status = 400
        // ctx.body = "error"
        const isBlack = inWhileList(ctx.request.headers)
        if(isBlack){
            ctx.status = 400;
            return ctx.body = "403 not found"
        }
        const body = ctx.request.body || {}
        const {tokenError, tokenInfo}  = await service.getToken(body)
        if (tokenError) {
            ctx.status = 400;
            return ctx.body = 'check with token!'
        }
        const t = await service.refund(tokenInfo)
        if(t.code === 2){
            ctx.status = 400;
            ctx.body = t
        }else if(t.code === 3){
            ctx.status = 200;
            ctx.body = t.data
        }else {
            ctx.body = t
        }
    }
}

module.exports = apiCall
