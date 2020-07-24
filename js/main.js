'use strict';

var adForm = document.querySelector('.ad-form');
var adFieldset = adForm.querySelectorAll('fieldset');
var mapFilters = document.querySelector('.map__filters');
var mapSelect = mapFilters.querySelectorAll('select');
var address = adForm.querySelector('#address');

// Константы для меток
var MAIN_PIN_X_OFFSET = 65 / 2;
var MAIN_PIN_Y = 85;
var MAIN_PIN_UNACTIVE_OFFSET = 156 / 2;

var mapPinsElement = document.querySelector('.map__pins');
var mainPin = mapPinsElement.querySelector('.map__pin--main');


// Задаёт адрес по главной метке
var addressInput = function (x, y) {
  address.value = Math.floor(mainPin.offsetLeft + x) + ', ' + Math.floor(mainPin.offsetTop + y);
};

// неактивное состояние страницы
adFieldset.forEach(function (item) {
  item.setAttribute('disabled', true);
});

mapFilters.querySelector('fieldset').setAttribute('disabled', true);

mapSelect.forEach(function (item) {
  item.setAttribute('disabled', true);
});

addressInput(MAIN_PIN_UNACTIVE_OFFSET, MAIN_PIN_UNACTIVE_OFFSET);

// активное состояние страницы
var ENTER_KEY = 'Enter';

var activeMode = function () {
  adForm.classList.remove('ad-form--disabled');

  adFieldset.forEach(function (item) {
    item.removeAttribute('disabled');
  });

  address.setAttribute('readonly', true);
  addressInput(MAIN_PIN_X_OFFSET, MAIN_PIN_Y);

  mapFilters
      .querySelector('fieldset')
      .removeAttribute('disabled');

  mapSelect.forEach(function (item) {
    item.removeAttribute('disabled');
  });

  document
      .querySelector('.map')
      .classList
      .remove('map--faded');

  mapPinsElement.appendChild(window.pin.addPins());
};

mainPin.addEventListener('mousedown', function (evt) {
  if (evt.button === 0) {
    activeMode();
  }
});

mainPin.addEventListener('keydown', function (evt) {
  if (evt.key === ENTER_KEY) {
    activeMode();
  }
});


// Валидация объявления

var roomsNumber = adForm.querySelector('#room_number');
var guestsNumber = adForm.querySelector('#capacity');
var housingType = adForm.querySelector('#type');
var pricePerNight = adForm.querySelector('#price');
var timeIn = adForm.querySelector('#timein');
var timeOut = adForm.querySelector('#timeout');

adForm.addEventListener('change', function () {
  // Валидация времени заезда и выезда
  timeOut.value = timeIn.value;

  // Валидация количества комнат и гостей
  if (roomsNumber.value === '1' && guestsNumber.value !== '1') {
    guestsNumber.setCustomValidity('для 1 гостя');
  } else if (roomsNumber.value === '2' && guestsNumber.value !== '2') {
    guestsNumber.setCustomValidity('для 2 гостей');
  } else if (roomsNumber.value === '3' && guestsNumber.value !== '3') {
    guestsNumber.setCustomValidity('для 3 гостей');
  } else if (roomsNumber.value === '100' && guestsNumber.value !== '0') {
    guestsNumber.setCustomValidity('не для гостей');
  } else {
    guestsNumber.setCustomValidity('');
  }

  // Валидация типа жилья и цены
  switch (housingType.value) {
    case 'bungalo':
      pricePerNight.min = '0';
      pricePerNight.placeholder = '0';
      break;
    case 'flat':
      pricePerNight.min = '1000';
      pricePerNight.placeholder = '1000';
      break;
    case 'house':
      pricePerNight.min = '5000';
      pricePerNight.placeholder = '5000';
      break;
    case 'palace':
      pricePerNight.min = '10000';
      pricePerNight.placeholder = '10000';
  }
});


var submitButton = adForm.querySelector('.ad-form__submit');
submitButton.addEventListener('click', function () {
  if (document.activeElement !== adForm) {
    submitButton.setCustomValidity('заполните форму');
  }
});

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
var HOUSE_TYPE = [
  'place',
  'flat',
  'house',
  'bungalo'];
var TIME = [
  '12:00',
  '13:00',
  '14:00'];
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

var advertisment = getAds();

var getMapPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < advertisment.length; i++) {
    fragment.appendChild(renderPins(advertisment[i]));
  }
  return fragment;
};

mapPins.appendChild(getMapPins());

// Отрисовка карточек объявлений
/*
var mapCardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');

var getAdType = function (offerType) {
  switch (offerType) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
  }

  return '';
};

var getAdPhotos = function (arrOfferPhotos, photosElement) {
  var fragment = document.createDocumentFragment();
  var photoElement;

  for (var i = 0; i < arrOfferPhotos.length; i++) {
    photoElement = photosElement.querySelector('.popup__photo').cloneNode();
    photoElement.src = arrOfferPhotos[i];

    fragment.appendChild(photoElement);
  }

  return fragment;
};

var renderOfferFeatures = function (arrOfferFeatures, cardElement) {
  var featuresElement = cardElement.querySelector('.popup__features');
  var featureElement;

  for (var j = 0; j < arrOfferFeatures.length; j++) {
    featureElement = featuresElement.querySelector('[class*="popup__feature--' + arrOfferFeatures[j] + '"]');
    featureElement.classList.add('popup__feature--show');
  }
};

var getFragmentMapCard = function (ad) {
  var fragment = document.createDocumentFragment();
  var mapCardElement = mapCardTemplate.cloneNode(true);

  mapCardElement.querySelector('.popup__title').textContent = ad.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  mapCardElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  mapCardElement.querySelector('.popup__type').textContent = getAdType(ad.offer.type);
  mapCardElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms +
    ' комнаты для ' + ad.offer.guests + ' гостей';
  mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' +
    ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  renderOfferFeatures(ad.offer.features, mapCardElement);
  mapCardElement.querySelector('.popup__description').textContent = ad.offer.description;

  var mapCardPhotosElement = mapCardElement.querySelector('.popup__photos');

  mapCardPhotosElement.replaceChild(getAdPhotos(ad.offer.photos, mapCardPhotosElement), mapCardPhotosElement.querySelector('.popup__photo'));
  mapCardElement.querySelector('.popup__avatar').src = ad.author.avatar;

  fragment.appendChild(mapCardElement);

  return fragment;
};

map.insertBefore(getFragmentMapCard(advertisment[0]), map.querySelector('.map__filters-container'));
*/
