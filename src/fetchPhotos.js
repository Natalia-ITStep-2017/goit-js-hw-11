import axios from "axios";

export class PhotoGallery {

  async getPhotos(q, page) {
    const options = {
      key: '34826254-f6a07a718c7d1b6fe10bcafdb',
      q: q,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 40,
    }
    return await axios.get(`https://pixabay.com/api/`, {
      params: options
    });
  }

  renderPhotos(photos) {
    return photos
      .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<a href="${largeImageURL}">
          <div class="photo-card">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
   
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
           ${likes}
        </p>
        <p class="info-item">
          <b>Views</b>
           ${views}
        </p>
        <p class="info-item">
          <b>Comments</b>
           ${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
           ${downloads}
        </p>
      </div>
    </div>
       </a>`)
      .join("");
  }
}



