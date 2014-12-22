var list = []; // a list of books , inventory i.e all books stored in localstorage
if (localStorage.getItem('list') === null) {
    localStorage.setItem('list', JSON.stringify(list));
}

function buy(e) {

    // this function take user to "Ad to Cart" page saving selected book id
    localStorage.setItem('id', $(e).closest('li.img-item').attr('id'));
    document.location = 'add.html';
}

function addBookToList(book) {
    // add a new book item in book list in html
    var authors = "";
    if (typeof(book.authors) != "undefined" && book.authors.length > 1) {
        authors = book.authors.join(' , ');
    } else {
        authors = typeof(book.authors) != "undefined" ? book.authors[0] : "Anonymous";
    }
    $('#booklist').append(
        "<li id='" + book.id + "' class='img-item'>" +
        "<div class='col-lg-6 col-md-6 img-div'>" +
        "<div class='col-lg-4 col-md-4'>" +
        "<a href='#' class='buy' >" +
        "<img src='" + book.thumbnail + "' class='span12 buy thumbnail' onclick='buy(this)' title='click to buy this book'>" +
        "</a>" +
        " </div>" +
        "<div class='col-lg-7 col-md-7'>" +
        "<p>Title :\t" + book.title + "</p>" +
        "<p>Author :\t" + authors + "</p>" +
        "<p>Publisher :\t" + book.publisher + "</p>" +
        "<p>Publish Date :\t" + book.publishedDate + "</p>" +
        "<p>Price :\t$" + book.price + "</p>" +
        "</div>" +
        "</div>" +
        "</li>");


}

function search() {
    // pick text from input search box and call Google Book Service API to get results
    //based on selection i.e Title, subtitle or Author
    if ($('#search').val().length > 0) {
        var query = $('#search').val().toLowerCase();
        var cat = $("#search-categories li.active").find('a').attr('value'); //category i.e. title,author etc
        $.get("https://www.googleapis.com/books/v1/volumes?q=" + query + "+" + cat + "&maxResults=40", //+"&key=AIzaSyC61tbyDSLm7YeETK8HoQNXRsLg4CNlrpo",
            function(data) {
                $('#booklist').empty(); // empty previous items in html in booklist div
                list = JSON.parse(localStorage.getItem('list')) || [];
                var fuzzySearch = [];
                // iterate through items returned by Google Book API
                for (var i = 0; i < data.items.length; i++) {
                    var info = data.items[i].volumeInfo;
                    $('#books').append("<option value='" + info.title + "'></option>");
                    var book;

                    if ((book = localStorage.getItem(data.items[i].id)) !== null) {
                        book = JSON.parse(book);
                        if (list.indexOf(book.id) < 0) {
                            list.push(book.id);
                        }
                        fuzzySearch.push(book)
                    } else {
                        try {
                            book =
                                new Book(
                                    data.items[i].id,
                                    info.title,
                                    info.subtitle,
                                    info.authors,
                                    info.description,
                                    info.imageLinks.thumbnail,
                                    info.canonicalVolumeLink,
                                    info.pageCount,
                                    info.averageRating,
                                    info.publishedDate,
                                    info.publisher, Math.round(Math.random() * 200) // sicnce no info about price so // make it random just to buy
                                );
                                // add book in localstorage
                            localStorage.setItem(book.id, JSON.stringify(book));
                            if (list.indexOf(book.id) < 0) {
                                list.push(book.id);
                            }

                            fuzzySearch.push(book);


                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
                var f = [];
                // check which category is selected and then search user input in that category
                if (cat == 'intitle') {
                    var options = {
                        keys: ['title']
                    }
                    f = new Fuse(fuzzySearch, options);
                }
                if (cat == 'inauthor') {
                    var options = {
                        keys: ['authors']
                    }
                    f = new Fuse(fuzzySearch, options);
                }
                if (cat == 'subject') {
                    var options = {
                        keys: ['subtitle']
                    }
                    f = new Fuse(fuzzySearch, options);
                }

                f.search(query).forEach(function(d, i) {
                    addBookToList(d);
                })
                localStorage.setItem('list', JSON.stringify(list));
                if ($('#booklist li').length == 0) {
                    $("#booklist").append("<h4>Sorry, No item found</h4>")
                }
            });

    }
}

// categories selection button list ; on click make it active or prominent 
$("#search-categories li").on('click', function() {
    $("#search-categories li").removeClass("active");
    $(this).toggleClass("active");
    search();
});
// when user input changes call search function to get new data 
$('#search').on('input', function() {
    search();
})

// show all books that are stored in localstorage
$("#inventory").on('click', function() {

    $("#booklist").empty();
    list = JSON.parse(localStorage.getItem('list'));
    list.forEach(function(d, i) {
        console.log(d)
        var b = JSON.parse(localStorage.getItem(d));
        if (b !== null) {
            addBookToList(b);
        }
    })
})
