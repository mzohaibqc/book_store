var BuyInfo = function(){
	
	this.books=[];
	this.addBook = function(id,count){
		this.books.push(new BookIDCount(id,count));
	}
}

var  BookIDCount= function(id, count){
	this.id = id;
	this.count = count;
}