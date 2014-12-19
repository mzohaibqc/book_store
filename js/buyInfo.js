var BuyInfo = function(){
	
	this.books=[];
	this.addBook = function(id){
		this.books.push(id);
	}
}

var  BookIDCount= function(id, count){
	this.id = id;
	this.count = count;
}