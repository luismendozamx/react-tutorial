var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;
var browserHistory = ReactRouter.browserHistory;
var helpers = require('./helpers');

// App component
var App = React.createClass({
  getInitialState: function() {
    return {
      fishes: {},
      order: {}
    };
  },

  addFish: function(fish) {
    var timestamp = (new Date()).getTime();

    // update state object
    this.state.fishes['fish-' + timestamp] = fish;

    // set state
    this.setState({ fishes: this.state.fishes });
  },

  render: function() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
        </div>
        <Order/>
        <Inventory addFish={this.addFish}/>
      </div>
    );
  }
});

var AddFishForm = React.createClass({
  createFish: function(event) {
    event.preventDefault();

    var fish = {
      name: this.refs.name.value,
      price: this.refs.price.value,
      status: this.refs.status.value,
      desc: this.refs.desc.value,
      image: this.refs.image.value
    };

    this.props.addFish(fish);
    this.refs.fishForm.reset();
  },

  render: function() {
    return (
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fish Name"/>
        <input type="text" ref="price" placeholder="Fish Price"/>
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Description"></textarea>
        <input type="text" ref="image" placeholder="Image URL"/>
        <button type="submit">+ Add Item</button>
      </form>
    );
  }
});

// Header component
var Header = React.createClass({
  render: function() {
    return (
      <header className="top">
        <h1>
          Catch
          <span className="ofThe">
            <span className="of">Of</span>
            <span className="the">The</span>
          </span>
          Day
        </h1>
        <h3 className="tagline"><span>{this.props.tagline}</span></h3>
      </header>
    );
  }
});

// Order component
var Order = React.createClass({
  render: function() {
    return (
      <p>Order</p>
    );
  }
});

// Inventory component
var Inventory = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Inventory</h2>
        <AddFishForm {...this.props} />
      </div>
    );
  }
});

// StorePicker component
var StorePicker = React.createClass({
  goToStore: function (event) {
    event.preventDefault();
    // get data from input
    var storeId = this.refs.storeId.value;
    browserHistory.push('/store/' + storeId);
  },
  render: function() {
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Please enter a store</h2>
        <input type="text" defaultValue={helpers.getFunName()} ref="storeId"/>
        <input type="submit"/>
      </form>
    );
  }
});

var NotFound = React.createClass({
  render: function() {
    return (
      <h1>Not Found</h1>
    );
  }
})

/*
  Routes
*/

var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={StorePicker}/>
    <Route path="/store/:storeId" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
);

ReactDOM.render(routes, document.getElementById('main'));
