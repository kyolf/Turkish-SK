'use strict';

class LinkedList{
  constructor(){
    this.head = null;
  }

  insert(curNode, turkWord, engWord, questId, weight){
    let nodeIns ={turkWord, engWord, questId, weight};

    if(!curNode){
      nodeIns.next = this.head;
      this.head = nodeIns;
    }
    else{
      nodeIns.next = curNode.next;
      curNode.next = nodeIns;
    }
  }

  insertAll(arr){
    let node;
    for(let i = 0; i < arr.length; i++){
      const nodeIns = {
        turkWord: arr[i].turkWord,
        engWord: arr[i].engWord,
        questId: arr[i].questId,
        weight: arr[i].weight
      };

      const curNode = node;

      if(!this.head){
        nodeIns.next = this.head;
        this.head = nodeIns;
        node = this.head;
      }
      else{
        nodeIns.next = curNode.next;
        curNode.next = nodeIns;
        node = node.next;
      }
    }
  }

  delete(){
    if(!this.head){
      return null;
    }
    
    let nextHead = this.head.next;
    this.head.next = null;
    let deletedNode = this.head;
    this.head = nextHead;
    return deletedNode;
  }

  deleteAll(){
    let arr = [];
    
    if(!this.head){
      return arr;
    }

    while(this.head !== null){
      const deleted = this.delete();
      arr.push({
        turkWord: deleted.turkWord,
        engWord: deleted.engWord,
        questId: deleted.questId,
        weight: deleted.weight
      });
    }
    return arr;
  }
}