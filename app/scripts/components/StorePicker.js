import React from 'react';
import { Navigation, browserHistory } from 'react-router';
import helpers from '../helpers';
import autobind from 'autobind-decorator';

@autobind
class StorePicker extends React.Component {
  goToStore(event) {
    event.preventDefault();
    // get data from input
    var storeId = this.refs.storeId.value;
    browserHistory.push('/store/' + storeId);
  }

  render() {
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Please enter a store</h2>
        <input type="text" defaultValue={helpers.getFunName()} ref="storeId"/>
        <input type="submit"/>
      </form>
    );
  }
};

export default StorePicker;
