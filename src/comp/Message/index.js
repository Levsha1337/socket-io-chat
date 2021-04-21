import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../Message/index.scss';

const TYPES = [
    ' alert', // alert
    '', // text
    ' alert', // join
    ' alert' // leave
];

class Message extends Component {
    render() {
        const type = `message-text${TYPES[this.props.type]}`;
        const time = new Date(this.props.time).toLocaleTimeString();
        const from = this.props.from ? this.props.from + ': ' : '';
        const text = from + this.props.text;

        return (
            <div className='message-box'>
                <div className='time'>{time}</div>
                <div className={type}>
                    {text}
                </div>
            </div>
        );
    }
}

Message.propTypes = {
    text: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    time: PropTypes.number.isRequired,
    from: PropTypes.string
};

export default Message;
