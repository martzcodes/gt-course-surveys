
var firebase = require('firebase');
var firebaseRef = new firebase('https://gt-surveyor.firebaseio.com/');

firebaseRef.child('reviews').on('child_added', function (review) {
  if (review.child('author').val() === 'anonymous') {
    console.log('updating ', review.key());
    firebaseRef.child('reviews').child(review.key()).child('author').set('c36c1a3f-6655-4f31-b0a4-971fdc87fbe6');
  }
});
