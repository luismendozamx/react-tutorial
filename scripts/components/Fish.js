import React from 'react';
import helpers from '../helpers';
import autobind from 'autobind-decorator';

@autobind
class Fish extends React.Component {
  onButtonClick() {
    this.props.addToOrder(this.props.index);
  }

  render() {
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
};

export default Fish;
