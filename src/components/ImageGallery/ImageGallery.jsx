import React, {Component} from "react";
import styles from "./ImageGallery.module.css";
import ImageGalleryItem from "components/ImageGalleryItem/ImageGalleryItem";
import PropTypes from "prop-types";

class ImageGallery extends Component {
  render () {
    const { images, openModal } = this.props;
        if (images.length === 0) {
            return null;
        }

    return (
      <>
        <ul className={styles.ImageGallery}>
          {images.map((image, id) => (
            <li key={id}>
              <ImageGalleryItem image={image} openModal={openModal} />
            </li>
        ))}
        </ul>
      </>
    )
  }
}

ImageGallery.propTypes = {
  images: PropTypes.array.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default ImageGallery;