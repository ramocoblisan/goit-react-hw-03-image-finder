import React, { Component } from "react";
import Button from "./Button/Button";
import ImageGallery from "./ImageGallery/ImageGallery";
import Loader from "./Loader/Loader";
import Modal from "./Modal/Modal";
import Searchbar from "./Searchbar/Searchbar";
import { config } from "./data/config";

export class App extends Component {
  constructor (props){
    super(props);
    this.state = {
      gallery:[],
      isLoading:false,
      query:'',
      page:1,
      error:null,
      isLoadMOre:true,
      isOpenModal: false,
      modalImage:''
    }
  }

  
  fetchGallery = async () => {
    this.abortController = new AbortController();
    const { signal } = this.abortController;
    const { query, page } = this.state;
    this.setState({ isLoading: true });

    try {
      const response = await fetch(`${config.URL}?q=${query}&page=${page}&key=${config.KEY}&image_type=photo&orientation=horizontal&per_page=12`, { signal });
      const data = await response.json();
      this.setState(prevState => ({
        gallery: [...prevState.gallery, ...data.hits],
        isLoading: false,
        error: null, 
      }));
    } catch (error) {
      console.error('Error fetching gallery:', error);
      this.setState({ isLoading: false, error });
    } finally {
      console.log('Fetching gallery completed');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { query, page, gallery } = this.state;
    
    if (query !== prevState.query || page !== prevState.page) {
      fetch(`${config.URL}?q=${query}&page=${page}&key=${config.KEY}&image_type=photo&orientation=horizontal&per_page=12`)
        .then(response => response.json())
        .then(data => {
          this.setState(prevState => ({
            gallery: [...prevState.gallery, ...data.hits],
            isLoading: false,
          }));
        })
        .catch(error => {
          console.error('Error fetching gallery:', error);
          this.setState({ isLoading: false, error });
        });
    } else if (gallery.length === 0 && prevState.gallery.length > 0) {
      this.setState({ gallery: [] });
    }
  }

  componentWillUnmount() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  handleSubmit = async (ev) => {
    ev.preventDefault();
    const newQuery = ev.target.elements.query.value;
    
    if (newQuery.toLowerCase().trim() !== "") {
      await this.setState({
        query: newQuery,
        page: 1, 
        gallery: [], 
      });
      
      this.fetchGallery(); 
    }
    
    ev.target.reset();
  }

  handleLoadMore = () => {
 
    this.setState(prevState => ({
      page: prevState.page + 1,
    }), () => {
      this.fetchGallery(); 
    });
  }

  openModal= (image) => {
    console.log(image);
    this.setState({
      isOpenModal: true,
      modalImage:image.largeImageURL,
    })
  }
  closeModal= () => {
    this.setState({
      isOpenModal: false,
      modalImage:'',
    })
  }

  render () {
    const { gallery, query, isLoading, isOpenModal, modalImage } = this.state;
    const totalImages = gallery.length;
    const showLoadMore = totalImages > 0 && !isLoading;

    return (
      <>
      <Searchbar onSubmit={this.handleSubmit} value={query} />
      {/* {isMesaje && <Messaje/>} */}
      {isLoading ? <Loader /> : <ImageGallery images={gallery} openModal={this.openModal} />}
      {showLoadMore && <Button onLoadMore={this.handleLoadMore} />}
      {isOpenModal && <Modal closeModal={this.closeModal} image={modalImage} />}
      {/* {isScroll && <ScrollButton/> } */}
      </>
    );
  }
};
