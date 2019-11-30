var change = document.getElementsByClassName('update')
var trash = document.getElementsByClassName('delete')
var editbtn = document.getElementsByClassName('editButton')
var trashbtn = document.getElementsByClassName('trashButton')
var changesButton = document.getElementById('changesButton')


console.log(trashbtn);
/*======================
delete book
======================*/
Array.from(trashbtn).forEach(function(element) {
      element.addEventListener('click', function(){
        const bookTitle  = this.parentNode.parentNode.childNodes[1].childNodes[1].innerHTML
        const bookAuthor = this.parentNode.parentNode.childNodes[1].childNodes[3].innerHTML
        const level = this.parentNode.parentNode.childNodes[1].childNodes[5].innerHTML
        const img = this.parentNode.parentNode.childNodes[1].childNodes[7]
        const bookIdTag = this.parentNode.parentNode.childNodes[1].childNodes[9].innerHTML
        fetch('/books', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'bookTitle': bookTitle,
            'bookAuthor': bookAuthor,
            'level' : level,
            'img': img,
            'bookIdTag': bookIdTag
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
/*==============================
update book content in table data sections
==============================*/
// Array.from(change).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const bookTitle  = this.parentNode.parentNode.childNodes[1].innerHTML
//         const bookAuthor = this.parentNode.parentNode.childNodes[3].innerHTML
//         const level = this.parentNode.parentNode.childNodes[5].innerHTML
//         const description = this.parentNode.parentNode.childNodes[7].innerHTML
//         fetch('/changedescription', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'bookTitle' : bookTitle,
//             'bookAuthor' : bookAuthor,
//             'level' : level,
//             'description' : description
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });
//
// /*========================
// scoring of books
// ========================*/
// function countWords(){
// 	s = document.getElementById("description").value;
// 	s = s.replace(/(^\s*)|(\s*$)/gi,"");
// 	s = s.replace(/[ ]{2,}/gi," ");
// 	s = s.replace(/\n /,"\n");
// 	document.getElementById("wordcount").value = s.split(' ').length;
// }
//
// const scoringUserBooks()=>{
//   countWords();
//   var bookTitle = document.getElementsByClassName('bookTitle')
//   var bookAuthor = document.getElementsByClassName('bookAuthor')
//   var level = document.getElementsByClassName('level')
//   var description = document.getElementsByClassName('description')
//   if (level === "easy" && )
// }
