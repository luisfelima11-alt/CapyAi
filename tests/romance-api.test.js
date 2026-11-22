'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),https=require('node:https');
const {EventEmitter}=require('node:events');
// Synthetic provider credentials only; tests never contact an external service.
process.env.OPENAI_API_KEY='test-only';
delete process.env.OPENROUTER_API_KEY;
const handler=require('../api/index.js');
async function call(url,body){
 const req=new EventEmitter(),res=new EventEmitter();
 req.url=url;req.method=body===undefined?'GET':'POST';req.headers={};req.socket={remoteAddress:'127.0.0.123'};req.destroy=()=>{};
 let finish;const finished=new Promise(resolve=>{finish=resolve});
 res.statusCode=200;res.headersSent=false;res.setHeader=()=>{};
 res.status=code=>{res.statusCode=code;return res;};
 res.json=data=>res.end(JSON.stringify(data));
 res.end=data=>{res.body=data;res.headersSent=true;res.emit('finish');finish();};
 const work=handler(req,res);
 process.nextTick(()=>{if(body!==undefined)req.emit('data',Buffer.from(JSON.stringify(body)));req.emit('end');});
 await work;await finished;
 return res;
}
test('lesson quiz and chat prompts use Spanish and Italian, never English by default',async()=>{
 const original=https.request,requests=[];
 https.request=(options,cb)=>{
  const request=new EventEmitter();request.setTimeout=()=>request;
  request.write=chunk=>{request.sent=String(chunk);};
  request.end=()=>{
   const body=JSON.parse(request.sent);requests.push(body);
   const response=new EventEmitter();response.statusCode=200;
   response.pipe=res=>res.end(Buffer.from('synthetic audio'));
   process.nextTick(()=>{
    cb(response);
    response.emit('data',JSON.stringify({choices:[{message:{content:'Resposta de teste'}}]}));
    response.emit('end');
   });
  };
  return request;
 };
 try{
  for(const [lang,name] of [['es','Spanish'],['it','Italian']]){
   const quiz=await call('/api/lesson-quiz',{lang,level:'A1',topic:'Greetings',vocab:['hola'],grammar:'Present tense'});
   assert.equal(quiz.statusCode,200);
   assert.match(requests.at(-1).messages[0].content,new RegExp(name+' quiz'));
   const chat=await call('/api/lesson-chat',{lang,message:'Olá',lessonTopic:'Greetings',vocab:['hola'],history:[]});
   assert.equal(chat.statusCode,200);
   assert.match(requests.at(-1).messages[0].content,new RegExp(name));
   const audio=await call('/api/tts?text=Hola&lang='+lang);
   assert.equal(audio.statusCode,200);
   assert.equal(requests.at(-1).model,'gpt-4o-mini-tts');
   assert.match(requests.at(-1).instructions,new RegExp('native '+name));
  }
 }finally{https.request=original;}
});
