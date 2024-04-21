import React, {Component} from "react";
import styles from "./Loader.module.css";
import PropTypes from "prop-types";
import { Circles } from "react-loader-spinner";

class Loader extends Component {
  render() {
    return (
      <>
        <div className={styles.loaderContainer}>
          <Circles
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="circles-loading"
          visible={true}
          />
        </div>
      </>
    )
  }
}

export default Loader;