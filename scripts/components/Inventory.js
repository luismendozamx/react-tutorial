import React from 'react';
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';
import Firebase from 'firebase';

const ref = new Firebase("https://react-test-catch.firebaseio.com/");

@autobind
class Inventory extends React.Component {
  constructor() {
    super();

    this.state = {
      uid: ''
    };
  }

  componentWillMount() {
    var token = localStorage.getItem('react-test-token');
    if (token) {
      ref.authWithCustomToken(token, this.authHandler);
    }
  }

  authenticate(provider) {
    ref.authWithOAuthPopup(provider, this.authHandler);
  }

  authHandler(err, authData) {
    if (err) {
      console.log(err);
      return;
    }

    // save login data
    localStorage.setItem('react-test-token', authData.token);

    // firebase store endpoint
    console.log(this.props);
    const storeRef = ref.child(this.props.params.storeId);

    storeRef.on('value', (snapshot) => {
      var data = snapshot.val() || {};

      // if no owner claim store
      if (!data.owner) {
        storeRef.set({
          owner: authData.uid
        });
      }

      // update state
      this.setState({
        uid: authData.uid,
        owner: data.owner || authData.uid
      });
    });
  }

  logout() {
    ref.unauth();
    localStorage.removeItem('react-test-token');
    this.setState({
      uid: null
    });
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Login to manage stores</p>
        <button className="github" onClick={this.authenticate.bind(this, 'github')}>Login with Github</button>
      </nav>
    );
  }

  renderInventory(key) {
    var linkState = this.props.linkState;

    return (
      <div className="fish-edit" key={key}>
        <input type="text" valueLink={linkState('fishes.' + key + '.name')} />
        <input type="text" valueLink={linkState('fishes.' + key + '.price')} />
        <select valueLink={linkState('fishes.' + key + '.status')}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out</option>
        </select>
        <textarea type="text" valueLink={linkState('fishes.' + key + '.desc')}></textarea>
        <input type="text" valueLink={linkState('fishes.' + key + '.image')} />
        <button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>
      </div>
    )
  }

  render() {
    let logOutButton = <button onClick={this.logout}>Log Out</button>;

    if (!this.state.uid) {
      return (
        <div>
          {this.renderLogin()}
        </div>
      );
    }

    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you are not the owner of this store.</p>
          {logOutButton}
        </div>
      );
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logOutButton}

        {Object.keys(this.props.fishes).map(this.renderInventory)}

        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    );
  }
};

Inventory.propTypes =  {
  addFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  fishes: React.PropTypes.object.isRequired,
  linkState: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired
};

export default Inventory;
