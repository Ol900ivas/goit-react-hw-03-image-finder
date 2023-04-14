import PropTypes from 'prop-types';
import { Component } from 'react';

import { Loader } from '../Loader/Loader';
import { getData } from 'servises/fetch';
import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';
import { Gallery } from './ImageGallery.styled';
import { Modal } from '../Modal/Modal';
import { LoadMoreBtn } from '../Button/Button';
import toast, { Toaster } from 'react-hot-toast';

export class ImageGallery extends Component {
  state = {
    images: null,
    loading: false,
    error: '',
    showModal: false,
    largeImageURL: '',
    page: 1,
    showLoadMoreBtn: false,
  };

  componentDidUpdate(prevProps, prevState) {
    const qwery = this.props.qwery.trim();
    const { page } = this.state;

    //==== Якщо новий запрос ====
    if (prevProps.qwery !== qwery && qwery) {
      this.setState({
        loading: true,
        images: null,
        showLoadMoreBtn: false,
      });
      getData(qwery, page)
        .then(data => {
          if (data.totalHits === 0) {
            this.setState({ loading: false });
            return toast.error(
              'Sorry, there are no images matching your search query. Please try again.'
            );
          }
          if (data.totalHits <= 12) {
            this.setState({
              loading: false,
              images: data.hits,
              showLoadMoreBtn: false,
              page: 1,
            });
            return toast.success("You've reached the end of search results.");
          }
          if (data.status === 'error') {
            this.setState({ loading: false });
            return Promise.reject(data.message);
          }
          this.setState({
            images: data.hits,
            loading: false,
            page: 1,
            showLoadMoreBtn: true,
          });
          console.log('totalHits', data.totalHits);
        })
        .catch(error => {
          this.setState({ loading: false });
          return toast.error(
            'ERROR. Sorry, something goes wrong. Please try again.'
          );
        });
    }

    //==== Якщо змінилася сторінка ====
    if (prevState.page !== page && page !== 1) {
      this.setState({ loading: true });

      getData(qwery, page).then(data => {
        //Розрахунок загальної кількості сторінок
        const totalPages = Math.ceil(data.totalHits / 12);
        console.log('totalPages', totalPages);
        if (page === totalPages) {
          this.setState({ loading: false, showLoadMoreBtn: false });
          this.setState(prevState => ({
            images: [...prevState.images, ...data.hits],
          }));
          return toast.success("You've reached the end of search results.");
        }
        this.setState({ loading: false, showLoadMoreBtn: true });
        this.setState(prevState => ({
          images: [...prevState.images, ...data.hits],
        }));
      });
    }
  }

  closeModal = () => {
    this.setState({ showModal: false });
  };

  onImgClick = e => {
    this.setState({ largeImageURL: e.target.alt, showModal: true });
  };

  onLoadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  render() {
    const { images, showModal, largeImageURL, loading, showLoadMoreBtn, page } =
      this.state;

    return (
      <>
        <div>
          <Toaster />
        </div>
        {showModal && (
          <Modal onClose={this.closeModal}>
            <img src={largeImageURL} alt="Large" />
          </Modal>
        )}
        {loading && page === 1 && <Loader />}

        {images && (
          <Gallery onClick={this.onImgClick}>
            {images.map(({ id, webformatURL, largeImageURL }) => {
              return (
                <li key={id}>
                  <ImageGalleryItem
                    id={id}
                    webformatURL={webformatURL}
                    largeImageURL={largeImageURL}
                  />
                </li>
              );
            })}
          </Gallery>
        )}
        {images && showLoadMoreBtn && (
          <LoadMoreBtn type="button" onClick={this.onLoadMore} />
        )}
        {loading && page !== 1 && <Loader />}
      </>
    );
  }
}

ImageGallery.propTypes = {
  qwery: PropTypes.string.isRequired,
};
