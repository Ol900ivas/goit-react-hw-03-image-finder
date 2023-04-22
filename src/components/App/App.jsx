import { Component } from 'react';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { GeneralWrap } from './App.styled';
import { Searchbar } from '../Searchbar/Searchbar';

export class App extends Component {
  state = {
    query: '',
  };

  createQuery = query => {
    this.setState({ query });
  };
  render() {
    return (
      <GeneralWrap>
        <Searchbar onSubmit={this.createQuery} />
        <ImageGallery query={this.state.query} />
      </GeneralWrap>
    );
  }
}
