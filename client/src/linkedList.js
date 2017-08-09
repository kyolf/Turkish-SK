'use strict';

class LinkedList{
  constructor(){
    this.head = null;
  }

  insert(curNode, value){
    let nodeIns ={value};

    if(!curNode){
      nodeIns.next = this.head;
      this.head = nodeIns;
    }
    else{
      nodeIns.next = curNode.next;
      curNode.next= nodeIns;
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
}