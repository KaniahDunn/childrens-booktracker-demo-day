var incentivesBtn = document.getElementsByName('incentiveButton')

Array.from(incentivesBtn).forEach(function(element) {
      element.addEventListener('click', function(){
        alert('this works')
        // const business  = this.parentNode.parentNode.childNodes[1].childNodes[1].innerHTML
        // const coupon = this.parentNode.parentNode.childNodes[1].childNodes[3].innerHTML
        // const points = this.parentNode.parentNode.childNodes[1].childNodes[5].innerHTML
        //
        // fetch('/selectIncentives', {
        //   method: 'put',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     'business': business,
        //     'coupon': coupon,
        //     'points' : points,
        //   })
        // }).then(function (response) {
        //   window.location.reload()
        })
    });
