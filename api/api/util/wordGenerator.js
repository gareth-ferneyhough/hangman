module.exports = { getRandomWord }

var easyWords = [
    'house',
    'plant',
    'cloud'
];

var mediumWords = [
    'password',
    'computer',
    'assembly'
];

var hardWords = [
    'autonomous',
    'asynchronous',
    'gyroscopic',
    'stabilization'
];

function getRandomWord(difficulty) {
    var dictionary;
    switch(difficulty) {
        case 'easy':
            dictionary = easyWords;
            break;
        case 'medium':
            dictionary = mediumWords;
            break;
        case 'hard':
            dictionary = hardWords;
            break;
        default:
            return undefined;
    }
    return dictionary[Math.floor(Math.random()*dictionary.length)];
}
