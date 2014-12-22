var BuyInfo = function(){
	
	this.books=[];  // list of user books which are in Buyer's cart
	this.addBook = function(id,count){
		this.books.push(new BookIDCount(id,count));
	}
}
// class to store buying info for one  book and its amount/counts. 
var  BookIDCount= function(id, count){
	this.id = id;
	this.count = count;
}