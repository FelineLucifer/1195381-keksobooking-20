'use strict';

var getRandomArrElement = function (arr) {
  var random = arr[Math.floor(Math.random() * arr.length)];
  return random;
};

var getRandomInteger = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getRandomArrLength = function (arr) {
  return arr.slice(getRandomInteger(0, arr.length));
};

var AD_NUMBER = 8;
var HOUSE_TYPE = ['place', 'flat', 'house', 'bungalo'];
var TIME = ['12:00', '13:00', '14:00'];
var FEATURE_ARR = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'];
var PHOTO_ARR = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var Locations = {
  X_MIN: 0,
  X_MAX: 1200,
  Y_MIN: 130,
  Y_MAX: 630,
};

// Функция генерации моков
var getAds = function () {
  var adsObject = [];
  for (var i = 0; i < AD_NUMBER; i++) {
    adsObject.push({
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: 'заголовок предложения',
        address: location.x + ' , ' + location.y,
        price: 'стоимость',
        type: getRandomArrElement(HOUSE_TYPE),
        rooms: 'количество комнат',
        guests: 'количество гостей',
        checkin: getRandomArrElement(TIME),
        checkout: getRandomArrElement(TIME),
        features: getRandomArrLength(FEATURE_ARR),
        description: 'строка с описанием',
        photos: getRandomArrLength(PHOTO_ARR)
      },
      location: {
        x: getRandomInteger(Locations.X_MIN, Locations.X_MAX),
        y: getRandomInteger(Locations.Y_MIN, Locations.Y_MAX)
      }
    });
  }
  return adsObject;
};

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var similarPinTemplate = document.querySelector('#pin')
.content
.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');

// Координаты метки
var PIN_X_OFFSET = 50 / 2;
var PIN_Y = 70;

// Отрисовка меток
var renderPins = function (ads) {
  var pinElement = similarPinTemplate.cloneNode(true);
  pinElement.style.left = ads.location.x - PIN_X_OFFSET + 'px';
  pinElement.style.top = ads.location.y - PIN_Y + 'px';
  pinElement.querySelector('img').src = ads.author.avatar;
  pinElement.querySelector('img').alt = ads.offer.title;

  return pinElement;
};

var fragment = document.createDocumentFragment();
var advertisment = getAds();

for (var i = 0; i < advertisment.length; i++) {
  fragment.appendChild(renderPins(advertisment[i]));
}
mapPins.appendChild(fragment);
