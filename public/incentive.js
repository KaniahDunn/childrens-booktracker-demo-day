// var incentivesBtn = document.getElementsByName('incentiveButton')
// var beginning = document.getElementsByClassName('bookSum').value
// var ending = document.getElementsByClassName('selectedincentive').value
//
// Array.from(incentivesBtn).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const business  = this.parentNode.parentNode.childNodes[1].innerHTML
//         const coupon = this.parentNode.parentNode.childNodes[3].innerHTML
//         const points = this.parentNode.parentNode.childNodes[5].innerHTML
//         const incentiveId = this.parentNode.parentNode.childNodes[7].innerHTML
//         fetch('/selectIncentives', {
//           method: 'post',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             'business': business,
//             'coupon': coupon,
//             'points' : points,
//             '_id': incentiveId
//           })
//         }).then(function (response) {
//           window.location.reload(getTotalPoints())
//         })
//     });
// });
