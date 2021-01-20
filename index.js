let getHealth = require('getHealth');
let Koa = require('koa');
let Router = require('koa-router');
let router = new Router();
let app = new Koa();
let axios = require('axios');
let md5 = require('md5');
let request = require('request');
let bodyParser = require('koa-bodyparser')
app.use(bodyParser())
let appsec ='15203deafb62435192456c3df8c4a707';
let appkey ='f29562eb3a8f4cc1878912fe334b375c';
let requestsec = '72df3aeefca54dc98c3f6c4c2eeff2df';
let idcard = '412701198410052014';
let getSecUrl = 'http://172.23.31.13:80/gateway/app/refreshTokenByKey.htm';
let getHealthUrl = 'http://172.23.31.13:80/gateway/api/001008006007001/dataSharing/cfe4n4fvP8Lz2qbe.htm';
//let c = new Promise((resolve)=>{
//resolve(getHealth(getSecUrl,appsec))
//})
//let res = await c;
console.log(102)
app.use(async (ctx,next)=>{
	let stime = new Date().getTime();
	await next();
	let etime = new Date().getTime();
	console.log(`address:${ctx.path},time:${etime-stime}ms`)
})
router.post('/',async (ctx)=>{
idcard = ctx.request.body.idcard
//console.log(103,(await getHealth(getHealthUrl,requestsec)).data)
//let result =(await getHealth(getSecUrl,appsec)).data

//console.log(ctx.request.headers)
let result = (await getHealth(idcard))
console.log(result)
ctx.body = result;
});

// function getHealth(url,reqsec){
// 	var newTime = new Date()
// 	var time = newTime.getTime()
// 	var str = appkey+reqsec+time
// 	var sign = md5(str)
// 	var param = `requestTime=${time}&sign=${sign}&appKey=${appkey}&sfzh=${idcard}`
// 	return new Promise((resolve)=>{axios.post(`${url}?${param}`).then(res=>{resolve(res)}).catch(err=>{resolve(err)})}
// )}

app.use(router.routes());
app.listen(8080);
