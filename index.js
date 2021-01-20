let Koa = require('koa');
let Router = require('koa-router');
let bodyparser = require('koa-bodyparser');
let axios = require('axios');
let router = new Router()
let app = new Koa();
let url = 'http://172.24.242.182:8080';
let data = {idcard:'321321199710057015'}

app.use(bodyparser());
app.use(async (ctx,next)=>{
	let stime = new Date().getTime();
	await next();
	let etime = new Date().getTime();
	console.log('time:'+(etime-stime)+'ms')
})
console.log('1001')
router.post('/getHealth',async(ctx)=>{ 
    let {name,idcard} = ctx.request.body;
    console.log(`name:${name}-${idcard}`);
       //let url = 'http://172.24.242.182:8080/getHealth?idcard='+idcard;
       //let data = {idcard:idcard};
       //await axios.post(url,data).then(res=>{
	//ctx.body = {code:200,data:res.data}}).catch(err=>{
	//ctx.body = {code:401,data:err}});
	let url = 'http://172.24.242.182:8080';
	
	let result = await axios.post(url,{idcard:idcard})
	console.log(result.data)
	try{
	ctx.body = result.data;
	}catch(err){cosole.err}
});
async function getHealth(){
	return await axios.get(url,data);
}
app.use(router.routes());
app.listen(8080);
