console.log('hi');
function startNewGame() {
    console.log('new game');
    var myImage = document.querySelector('img');

    fetch('flowers.jpeg')
    .then(function(response) {
      return response.blob();
    })
    .then(function(myBlob) {
      var objectURL = URL.createObjectURL(myBlob);
      myImage.src = objectURL;
    });
}
