class MessageQueue{
  constructor(semaphore=1){
    this.semaphore=semaphore;
    this.queue=[];
  }
  dispatchNext(){
    let f=this.queue.shift();
    if(f){
      f().finally(()=>this.dispatchNext());
    }else{
      ++this.semaphore;
    }
  }
  postMessage(f){
    this.queue.push(f);
    if(0<this.semaphore){
      --this.semaphore;
      this.dispatchNext();
    }
  }
}

module.exports={
  MessageQueue,
}