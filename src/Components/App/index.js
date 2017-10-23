import React, { Component } from 'react';
import './App.css';
import {feathersClient} from '../feathersClient';
import PageSlider from '../react-page-slider';
import SwipeableViews from 'react-swipeable-views';
import Home from '../Home';
import ReviewMilestones from '../ReviewMilestones';
import SearchMilestones from '../SearchMilestones';
import CreateMilestone from '../CreateMilestone';
import MyMilestones from '../MyMilestones';
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      milestones: [],
      currentView: 0,
    };

    const milestones = feathersClient.service('milestones');
    milestones.find({
      query: {
        $limit: 100,
        $sort: {
          completion_date: 1
        }
      }
    }).then( response => {
      const milestones = response.data;
      this.setState({milestones});
    });

    this.element = <div />;

    this.homeView = this.homeView.bind(this);
    this.reviewMilestones = this.reviewMilestones.bind(this);
    this.searchMilestones = this.searchMilestones.bind(this);
    this.createNewMilestone = this.createNewMilestone.bind(this);
    this.myMilestones = this.myMilestones.bind(this);
  }

  homeView() {
    this.setState({ currentView: 0 });
  }

  reviewMilestones() {
    this.setState({ currentView: 1 });
  }

  searchMilestones() {
    this.setState({ currentView: 2 });
  }

  createNewMilestone() {
    this.setState({ currentView: 3 });
  }

  myMilestones() {
    this.setState({ currentView: 4 });
  }

  render() {
    switch(this.state.currentView) {
      case 1:
        this.element = <ReviewMilestones
                    homeView={this.homeView}
                  />
        break;
      case 2:
        this.element = <SearchMilestones
                    milestones={this.state.milestones}
                    homeView={this.homeView}
                  />
        break;
      case 3:
        this.element = <CreateMilestone
                    milestones={this.state.milestones}
                    homeView={this.homeView}
                  />
        break;
      case 4:
        this.element = <MyMilestones
                    milestones={this.state.milestones}
                    homeView={this.homeView}
                  />
        break;
    }
    return (
      <SwipeableViews
        index={this.state.currentView === 0 ? 0 : 1}
        disabled={true}
      >
        <Home
          reviewMilestones={this.reviewMilestones}
          searchMilestones={this.searchMilestones}
          createNewMilestone={this.createNewMilestone}
          myMilestones={this.myMilestones}
        />
        { this.element }
      </SwipeableViews>
    );
/*
    return (
      <div className="App">
        <PageSlider show={true} slideFrom={'left'}>
          <Home
            reviewMilestones={this.reviewMilestones}
            searchMilestones={this.searchMilestones}
            createNewMilestone={this.createNewMilestone}
            myMilestones={this.myMilestones}
          />
        </PageSlider>
        <PageSlider show={this.state.currentView === 1} slideFrom={'right'}>
          <ReviewMilestones
            homeView={this.homeView}
          />
        </PageSlider>
        <PageSlider show={this.state.currentView === 2} slideFrom='right'>
          <SearchMilestones
            milestones={this.state.milestones}
            homeView={this.homeView}
          />
        </PageSlider>
        <PageSlider show={this.state.currentView === 3} slideFrom='right'>
          <CreateMilestone
            milestones={this.state.milestones}
            homeView={this.homeView}
          />
        </PageSlider>
        <PageSlider show={this.state.currentView === 4} slideFrom='right'>
          <MyMilestones
            milestones={this.state.milestones}
            homeView={this.homeView}
          />
        </PageSlider>
      </div>
    );*/
  }
}

const styles = {
  slide: {
    padding: 15,
    minHeight: 100,
    color: '#fff'
  },
  slide1: {
    background: '#FEA900'
  },
  slide2: {
    background: '#B3DC4A'
  },
  slide3: {
    background: '#6AC0FF'
  }
};

export default App;
