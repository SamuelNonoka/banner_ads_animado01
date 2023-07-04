document.addEventListener("DOMContentLoaded", initApplication);

const API =
  "https://rekrutacja.webdeveloper.rtbhouse.net/files/banner_vip.json";
const _SUCCESS = 200;

async function initApplication() {
  const offers = await loadOffers();
  Dom.mountOffers(offers);

  setTimeout(() => {
    setBanner(offers);
  }, 1000);
}

function setBanner(offers) {
  const bannerItem = document.querySelector(".banner-item");
  bannerItem.classList.add("slide-in");

  const slide = new SlideAnimation(offers.length);
  slide.start();
}

function formatPrice(price, currency) {
  return new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: currency,
  }).format(price);
}

async function loadOffers() {
  const response = await fetch(API);

  if (response.status !== _SUCCESS) return [];

  const data = await response.json();
  return data.offers;
}

class SlideAnimation {
  slideItems;
  currentSlidePosition;

  constructor(slideItems) {
    this.slideItems = slideItems;
    this.currentSlidePosition = 0;
  }

  start() {
    setInterval(() => {
      this.slide();
    }, 4000);
  }

  slide() {
    let slideToAdd = 0;
    const maximunIndex = this.slideItems - 1;

    if (this.currentSlidePosition < maximunIndex) {
      slideToAdd = this.currentSlidePosition + 1;
    }

    let slideToRemove = slideToAdd - 1;
    if (slideToAdd === 0) {
      slideToRemove = maximunIndex;
    }

    const offerElementNodes = document.querySelectorAll(".banner-item");

    const offerToRemove = offerElementNodes[slideToRemove];
    offerToRemove.classList.add("slide-out");

    const offerElement = offerElementNodes[slideToAdd];

    setTimeout(() => {
      offerElement.classList.add("slide-in");
    }, 1500);

    setTimeout(() => {
      offerToRemove.classList.remove("slide-in");
      offerToRemove.classList.remove("slide-out");
    }, 2000);

    this.currentSlidePosition = slideToAdd;
  }
}

class Dom {
  static mountOffers(offers) {
    offers.forEach((offer) => {
      new Dom().mountOffer(offer);
    });
  }

  async mountOffer(offer) {
    const bannerItemElement = this.createElement("article", ["banner-item"]);

    const picture = this.createElement("picture");
    const image = this.createElement(
      "img",
      ["banner-image"],
      [{ name: "data-src", value: offer.imgURL }]
    );
    picture.appendChild(image);
    bannerItemElement.appendChild(picture);

    const place = this.createElement("article", ["place"]);
    const country = this.createElement("h2", ["country"]);
    const countryText = this.createElement("span");
    countryText.textContent = offer.country;
    country.appendChild(countryText);
    place.appendChild(country);

    const city = this.createElement("h1", ["city"]);
    const cityText = this.createElement("span");
    cityText.textContent = offer.city;
    city.appendChild(cityText);
    place.appendChild(city);
    bannerItemElement.appendChild(place);

    const price = this.createElement("article", ["price"]);
    const priceLabel = this.createElement("label");
    priceLabel.textContent = "From";
    const priceSpan = this.createElement("span");
    priceSpan.textContent = formatPrice(offer.price, offer.currency);
    price.appendChild(priceLabel);
    price.appendChild(priceSpan);
    bannerItemElement.appendChild(price);

    const rootElement = document.querySelector(".banners");
    rootElement.appendChild(bannerItemElement);

    setTimeout(() => {
      const src = offer.imgURL;
      const img = document.querySelector(`[data-src="${offer.imgURL}"]`);
      img.setAttribute("src", src);
    }, 100);
  }

  createElement(tag, classList = [], attributeList = []) {
    const element = document.createElement(tag);

    attributeList.forEach((attr) => {
      element.setAttribute(attr.name, attr.value);
    });

    classList.forEach((className) => {
      element.classList.add(className);
    });

    return element;
  }
}
