var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;
var browserHistory = ReactRouter.browserHistory;
var helpers = require('./helpers');

// Firebase
var Rebase = require('re-base');
var base = Rebase.createClass('https://react-test-catch.firebaseio.com/')

// App component
var App = React.createClass({
  getInitialState: function() {
    return {
      fishes: {},
      order: {}
    };
  },

  componentDidMount: function() {
    base.syncState(this.props.params.storeId + '/fishes', {
      context: this,
      state: 'fishes'
    });

    var order = localStorage.getItem('order-' + this.props.params.storeId);

    if (order) {
      this.setState({ order: JSON.parse(order) });
    }
  },

  componentWillUpdate: function(nextProps, nextState) {
    localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
  },

  addFish: function(fish) {
    var timestamp = (new Date()).getTime();

    // update state object
    this.state.fishes['fish-' + timestamp] = fish;

    // set state
    this.setState({ fishes: this.state.fishes });
  },

  loadSamples: function() {
    this.setState({
      fishes: require('./sample-fishes')
    });
  },

  renderFish: function(key) {
    return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />;
  },

  addToOrder: function(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({ order: this.state.order });
  },

  render: function() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order}/>
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples}/>
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
  renderOrder: function(key) {
    var fish = this.props.fishes[key];
    var count = this.props.order[key];

    if (!fish) {
      return <li key={key}>Sorry, no longer available</li>
    }

    return (
      <li key={key}>
        {count}lbs
        {fish.name}
        <span className="price">{helpers.formatPrice(count * fish.price)}</span>
      </li>
    );
  },
  render: function() {
    var orderIds = Object.keys(this.props.order);
    var total = orderIds.reduce((prevTotal, key) => {
      var fish = this.props.fishes[key];
      var count = this.props.order[key];
      var isAvailable = fish && fish.status === 'available';

      if (fish && isAvailable) {
        return prevTotal + (count * parseInt(fish.price) || 0);
      }

      return prevTotal;
    }, 0);

    return (
      <div className="order-wrap">
        <h2 className="order-title">Your Order</h2>
        <ul className="order">
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total: </strong>
            {helpers.formatPrice(total)}
          </li>
        </ul>
      </div>
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
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
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

var Fish = React.createClass({
  onButtonClick: function() {
    this.props.addToOrder(this.props.index);
  },

  render: function() {
    var details = this.props.details;
    var isAvailable = details.status === 'available' ? true : false;
    var butttonText = isAvailable ? 'Add to Order' : 'SOLD OUT';

    return (
      <li className="menu-fish">
        <img src={details.image} alt={details.name}/>
        <h3 className="fish-name">
          {details.name}
          <span className="price">{helpers.formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>{butttonText}</button>
      </li>
    );
  }
})

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
