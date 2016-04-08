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
  render: function() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
        </div>
        <Order/>
        <Inventory/>
      </div>
    );
  }
});

var AddFishForm = React.createClass({
  render: function() {
    return (
      <p>Test</p>
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
      <p>Inventory</p>
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
