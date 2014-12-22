var list = [];
if(localStorage.getItem('list') === null){
  localStorage.setItem('list', JSON.stringify(list));
}

console.log("test ")
function buy(e){
        console.log("catch it")
        console.log($(e).closest('li.img-item').attr('id'))
        localStorage.setItem('id', $(e).closest('li.img-item').attr('id'));
        document.location = 'add.html';
      }

      function addBookToList(book){
        var authors ="";
        if(book.authors.length > 1){
          authors = book.authors.join(' , ');
        }else{
          authors = book.authors[0];
        }
          $('#booklist').append(
            "<li id='"+book.id+"' class='img-item'>"+
              "<div class='col-lg-6 col-md-6 img-div'>"+
                "<div class='col-lg-4 col-md-4'>"+
                  "<a href='#' class='buy' >"+
                    "<img src='"+book.thumbnail+"' class='span12 buy thumbnail' onclick='buy(this)' title='click to buy this book'>"+
                  "</a>"+
                " </div>"+
                "<div class='col-lg-7 col-md-7'>"+
                  "<p>Title :\t"+book.title+"</p>"+
                  "<p>Author :\t"+authors+"</p>"+
                  "<p>Publisher :\t"+book.publisher+"</p>"+
                  "<p>Publish Date :\t"+book.publishedDate+"</p>"+
                  "<p>Price :\t$"+book.price+"</p>"+
                "</div>"+
              "</div>"+
            "</li>");
        
        
      }

      function search(){
        if($('#search').val().length > 0){
            var query = $('#search').val().toLowerCase();
            var cat = $("#search-categories li.active").find('a').attr('value');//html().toLowerCase();
            $.get("https://www.googleapis.com/books/v1/volumes?q="+ query + "+"+ cat+"&maxResults=40" ,//+"&key=AIzaSyC61tbyDSLm7YeETK8HoQNXRsLg4CNlrpo",
            function(data){
                  $('#booklist').empty();
                  //$('#books').empty();
                  for(var i=0; i< data.items.length; i++){
                      console.log(data.items[i])
                      var info = data.items[i].volumeInfo;
                      $('#books').append("<option value='"+info.title+"'></option>");
                      var book;
                      list = JSON.parse(localStorage.getItem('list'));
                      if((book = localStorage.getItem(data.items[i].id)) !== null){
                          book = JSON.parse(book);
                          if(list.indexOf(book.id) < 0){
                            list.push(book.id);
                          }
                          //addBookToList(book);
                          if(cat=='intitle'){
                               console.log(typeof(book.title) !='undefined' && book.authors.join(',').toLowerCase())
                              if(book.title.toLowerCase().search(query)!=-1){
                                addBookToList(book);
                              }
                            }
                            if(cat == 'inauthor'){
                              console.log(book.authors.join(','))
                              if(typeof(book.authors) !='undefined' && book.authors.join(',').toLowerCase().search(query)!=-1){
                                addBookToList(book);
                              }
                            }
                            if(cat == 'subject'){
                              if(typeof(book.subject) !='undefined' && book.subject.toLowerCase().search(query)!=-1){
                                addBookToList(book);
                              }
                            }

                      }
                      else{
                        try{
                          book = 
                          new Book(
                            data.items[i].id ,
                            info.title, 
                            info.authors, 
                            info.description,
                            info.imageLinks.thumbnail, 
                            info.canonicalVolumeLink, 
                            info.pageCount, 
                            info.averageRating ,
                            info.publishedDate ,
                            info.publisher,Math.round(Math.random()*200)  // sicnce no info about price so // make it random just to buy
                          );
                          localStorage.setItem(book.id, JSON.stringify(book));
                          if(list.indexOf(book.id) < 0){
                            list.push(book.id);
                          }
                          

                          //addBookToList(book);
                            if(cat=='intitle'){
                               console.log(typeof(book.title) !='undefined' && book.authors.join(','))
                              if(book.title.toLowerCase().search(query)!=-1){
                                addBookToList(book);
                              }
                            }
                            if(cat == 'inauthor'){
                              console.log(book.authors.join(','))
                              if(typeof(book.authors) !='undefined' && book.authors.join(',').toLowerCase().search(query)!=-1){
                                addBookToList(book);
                              }
                            }
                            if(cat == 'subject'){
                              if(typeof(book.subject) !='undefined' && book.subject.toLowerCase().search(query)!=-1){
                                addBookToList(book);
                              }
                            }    
                          
                        }
                        catch(e){
                            console.log(e);
                        }
                      }
                  }
                  localStorage.setItem('list', JSON.stringify(list));
            });
            
        }
      }
$("#search-categories li").on('click', function() {
        $("#search-categories li").removeClass("active");
        $(this).toggleClass("active");
        search();
    });

    $('#search').on('input', function() {
        search();
    })
$("#inventory").on('click', function(){

  $("#booklist").empty();
  list = JSON.parse(localStorage.getItem('list'));
  list.forEach(function(d, i){
    console.log("Inventory")
      var b = JSON.parse(localStorage.getItem(d));
      if(b !== null){
        addBookToList(b);
      }
  })
})