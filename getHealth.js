//依赖
const md5 = require('md5');
let axios = require('axios');
//常量
let AppKey = 'f29562eb3a8f4cc1878912fe334b375c';
let AppSec = '15203deafb62435192456c3df8c4a707';
let RefreshTokenBySecUrl = 'http://172.23.31.13:80/gateway/app/refreshTokenBySec.htm';
let RefreshTokenByKeyUrl = 'http://172.23.31.13:80/gateway/app/refreshTokenByKey.htm';
let GetHealthUrl = 'http://172.23.31.13:80/gateway/api/001008006007001/dataSharing/cfe4n4fvP8Lz2qbe.htm';
let CloudBaseUrl = 'https://env-web-16c0e3-1258099036.ap-shanghai.service.tcloudbase.com/secrect';
//获取健康码状况
async function getHealth(idcard){
	var reqSec = await getSecret(`${CloudBaseUrl}?method=getSecret`);
	console.log(reqSec);
	var back = (await getData(GetHealthUrl,reqSec,`&sfzh=${idcard}`)).data;
	return back;
}

//数据请求
async function getData(reqUrl,reqSec,fields){
    var time = new Date().getTime();
    var str = AppKey + reqSec + time;
    var sign = md5(str);
    var param = `requestTime=${time}&sign=${sign}&appKey=${AppKey}${fields}`;
    var url = `${reqUrl}?${param}`;
    let result = await axios.post(url);
    return result;
}

//刷新密钥
async function refresh(reqUrl,reqSec){
    var time = new Date().getTime();
    var str = AppKey + reqSec + time;
    var sign = md5(str);
    var param = `requestTime=${time}&sign=${sign}&appKey=${AppKey}`;
    var url = `${reqUrl}?${param}`;

  const promise = new Promise((resolve, reject) => {
    axios.post(url).then(response=>{
  	var res = response.data;
      //获取到新的请求秘钥
      //秘钥持久化.datas.requestSecret
      var fields = JSON.stringify(res.datas);
      saveSecret(`${CloudBaseUrl}?method=saveSecret&data=${fields}`);
      //resolve('1')
      resolve(res.datas.requestSecret);
  	}).catch(err=>{reject(err);})
  });
  return promise;
}

//获取最新的请求秘钥
async function getSecret(url){
	const promise = new Promise((resolve,reject)=>{
  	axios.post(url).then(response=>{
	console.log(response)
	 var res = response.data;
    	if (res.code == 2) {
    		//使用bysec刷新秘钥
      	resolve(refresh(RefreshTokenBySecUrl, res.data.refreshSecret));
      } else if (res.code == 3) {
         //使用bykey刷新秘钥
         resolve(refresh(RefreshTokenByKeyUrl, AppSec));
      } else {
         //请求秘钥有效
         resolve(res.data.requestSecret);
       }
  	}).catch(err=>{reject(err);})
  })
  return promise;
}

//持久化秘钥
async function saveSecret(url) {
  axios.post(url).then(response=>{
  		var res = response;
    	if (res.updated) {
        console.log('秘钥更新');
      }
  	}).catch(err=>{console.log('出现错误',err);});
}

module.exports = { getHealth }
