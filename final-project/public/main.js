var change = document.getElementsByClassName('update')

var trash = document.getElementsByClassName('delete')

/*==============================
update book content in table data sections
==============================*/
Array.from(change).forEach(function(element) {
      element.addEventListener('click', function(){
        const bookTitle  = this.parentNode.parentNode.childNodes[1].innerHTML
        const bookAuthor = this.parentNode.parentNode.childNodes[3].innerHTML
        const level = this.parentNode.parentNode.childNodes[5].innerHTML
        const description = this.parentNode.parentNode.childNodes[7].innerHTML
        fetch('/changedescription', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'bookTitle' : bookTitle,
            'bookAuthor' : bookAuthor,
            'level' : level,
            'description' : description
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

/*======================
delete entire book row
======================*/
Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const bookTitle  = this.parentNode.parentNode.childNodes[1].innerHTML
        const bookAuthor = this.parentNode.parentNode.childNodes[3].innerHTML
        const level = this.parentNode.parentNode.childNodes[5].innerHTML
        const description = this.parentNode.parentNode.childNodes[7].innerHTML
        fetch('/deletebook', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'bookTitle': bookTitle,
            'bookAuthor': bookAuthor,
            'level' : level,
            'description' : description
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
