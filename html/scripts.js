console.log('hi');
function startNewGame() {
    console.log('new game');

    // var myImage = document.querySelector('img');
    // var responseElement = document.querySelector()
    var myHeaders = new Headers();
    var myInit = { method: 'POST' };

    fetch('/game', myInit)
    .then(function(response) {
        response.json().then(j => {
            console.log(j);
        });
        // console.log(response.json());
      //return response.blob();
  });
    // .then(function(myBlob) {
    //   var objectURL = URL.createObjectURL(myBlob);
    //   myImage.src = objectURL;
    // });
}
