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
            'bookTitle': bookTitle,
            'bookAuthor': bookAuthor,
            'level':level,
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

// Array.from(change).forEach(function(element) {
//   element.addEventListener('click', function(){
//     const bookTitle  = this.parentNode.parentNode.childNodes[1].innerHTML
//     const bookAuthor = this.parentNode.parentNode.childNodes[3].innerHTML
//     const level = this.parentNode.parentNode.childNodes[5].innerHTML
//     const description = this.parentNode.parentNode.childNodes[7].innerHTML
//     fetch('/changeauthor', {
//       method: 'put',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({
//         'bookTitle': bookTitle,
//         'bookAuthor': bookAuthor,
//         'level': level,
//         'description' : description
//       })
//     })
//     .then(response => {
//       if (response.ok) return response.json()
//     })
//     .then(data => {
//       console.log(data)
//       window.location.reload(true)
//     })
//   });
// });

/*======================
delete entire book row
======================*/
Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        alert('this works')
        // const name = this.parentNode.parentNode.childNodes[1].innerText
        // const msg = this.parentNode.parentNode.childNodes[3].innerText
        // fetch('messages', {
        //   method: 'delete',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     'name': name,
        //     'msg': msg
        //   })
        // }).then(function (response) {
        //   window.location.reload()
        // })
      });
});


// var thumbUp = document.getElementsByClassName("fa-thumbs-up");
// var trash = document.getElementsByClassName("fa-trash");
// var thumbDown = document.getElementsByClassName("fa-thumbs-down")


// Array.from(thumbUp).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//         fetch('messages', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//             'thumbUp':thumbUp
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
// Array.from(thumbDown).forEach(function(element) {
//   element.addEventListener('click', function(){
//     const name = this.parentNode.parentNode.childNodes[1].innerText
//     const msg = this.parentNode.parentNode.childNodes[3].innerText
//     const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//     fetch('messagesDown', {
//       method: 'put',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({
//         'name': name,
//         'msg': msg,
//         'thumbUp':thumbUp
//       })
//     })
//     .then(response => {
//       if (response.ok) return response.json()
//     })
//     .then(data => {
//       console.log(data)
//       window.location.reload(true)
//     })
//   });
// });
// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         fetch('messages', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg
//           })
//         }).then(function (response) {
//           window.location.reload()
//         })
//       });
// });
