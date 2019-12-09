var changesButton = document.getElementById('changesButton')


changesButton.addEventListener('click', function (){
    const bookTitle = document.getElementById('bookTitle').value
    const bookAuthor = document.getElementById('bookAuthor').value
    const level = document.getElementById('level').value
    const description = document.getElementById('description').value
    const userId = this.getAttribute('data-userId')
    console.log(userId);
    // const img = this.parentNode.parentNode.childNodes[1].childNodes[7]
    fetch('/updatebook', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'bookTitle' : bookTitle,
        'bookAuthor' : bookAuthor,
        'level' : level,
        'description' : description,
        'userId' : userId
        // 'img': img
      })
    })
      .then(response => {
        if (response.ok) return response.ejs
      })
      .then(data => {
        console.log(data)
        window.location.href = "/profile"
      })
});
