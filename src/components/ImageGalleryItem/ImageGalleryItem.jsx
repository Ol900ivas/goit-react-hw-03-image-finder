import PropTypes from 'prop-types';
import { ItemWrap, Img } from './ImageGalleryItem.styled';

export const ImageGalleryItem = ({ id, webformatURL, largeImageURL }) => {
  return (
    <ItemWrap>
      <Img src={webformatURL} alt={largeImageURL} id={id} />
    </ItemWrap>
  );
};

ImageGalleryItem.propTypes = {
  id: PropTypes.string.isRequired,
  webformatURL: PropTypes.string.isRequired,
  largeImageURL: PropTypes.string.isRequired,
};
