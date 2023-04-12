import './css/styles.css';
import { PhotoGallery } from './fetchPhotos.js';
import lodash from 'lodash'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';

const photoGallery = new PhotoGallery();
let photosResponse;
const photosListEl = document.querySelector('.gallery');
const resultMessageEl = photosListEl.nextElementSibling;
const formEl = document.querySelector('.search-form');
const inputEl = formEl.firstElementChild;
let page;
let totalPages;
let query;
const gallery = new SimpleLightbox('.gallery a');


const handleSubmitSearch = async (event) => {
  event.preventDefault();
  resultMessageEl.classList.add('hidden');
  query = event.currentTarget.firstElementChild.value.trim();
  page = 1;
  if (!query) {
    photosListEl.innerHTML = '';
    Notiflix.Notify.failure("Search field cannot be empty!");
    return;
  } else {
    try {
      photosResponse = await photoGallery.getPhotos(query, page);
    } catch (error) {
      console.error(error);
    }
    totalPages = Math.ceil(photosResponse.data.totalHits / 40);
    if (!photosResponse.data.hits.length) {
      photosListEl.innerHTML = '';
      Notiflix.Notify.
        failure("Sorry, there are no images matching your search query. Please try again.");
    } else {
      Notiflix.Notify.success(`Hooray! We found ${photosResponse.data.totalHits} images.`);
      photosListEl.innerHTML = photoGallery.renderPhotos(photosResponse.data.hits);
      gallery.refresh();
    }
  }
}

formEl.addEventListener('submit', handleSubmitSearch);

const handleInfiniteScroll = async () => {
  const endOfPage =
    window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight;

  if (page >= totalPages) {
    resultMessageEl.classList.remove('hidden');
    removeInfiniteScroll();
  } else {
    if (endOfPage) {
      page += 1;
      try {
        photosResponse = await photoGallery.getPhotos(query, page);
      } catch (error) {
        console.error(error);
      }
      photosListEl.insertAdjacentHTML("beforeend", photoGallery.renderPhotos(photosResponse.data.hits));
      gallery.refresh();
    }
  }
}

const removeInfiniteScroll = () => {
  window.removeEventListener("scroll", handleInfiniteScroll);
};

window.addEventListener("scroll", lodash.throttle(handleInfiniteScroll, 1000));


