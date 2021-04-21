import React, { Component } from 'react';
import PropTypes from 'prop-types';

import io from 'socket.io-client';

import './index.scss';
import Message from '../Message';

class Chat extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            messages: [],
            users: []
        };

        this.inputBox = React.createRef();
        this.messagesBox = React.createRef();

        this.copyLink = this.copyLink.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.setAsyncState = this.setAsyncState.bind(this);
        this.initChatConnection = this.initChatConnection.bind(this);
        
        this.room = props.room;
    }

    setAsyncState(newState) {
        return new Promise((resolve) => this.setState(newState, resolve));
    }

    componentDidMount() {
        this.inputBox.current.addEventListener('keydown', this.onKeyDown);

        this.initChatConnection();
    }

    componentWillUnmount() {
        this.socket.disconnect();
    }

    initChatConnection() {
        const login = this.props.login || prompt('Please, enter username');

        let host = undefined;
        if (this.props.server !== undefined && this.props.port !== undefined) {
            host = `//${this.props.server}:${this.props.port}`;
        }

        const socket = io(host);
        this.socket = socket;

        this.socket.on('connect', () => {
            socket.emit('login', login, this.props.room);
        });

        this.socket.on('room', (room) => {
            history.replaceState(null, `Chat - room ${room}`, `/?${new URLSearchParams({room, login}).toString()}`);
            this.room = room;
        });

        this.socket.on('message', async (message) => {
            // handling message types
            switch (message.type) {
            case 2:
                message.text = `${message.text} joined the room`;
                break;
            case 3:
                message.text = `${message.text} left the room`;
                break;

            default: break;
            }

            const mb = this.messagesBox.current;
            const onEnd = mb.offsetHeight + mb.scrollTop >= mb.scrollHeight;
            await this.setAsyncState({
                messages: [...this.state.messages, message]
            });

            if (onEnd) mb.scrollTop = mb.offsetHeight;
        });

        this.socket.on('list', (list) => {
            this.setState({
                users: list
            });
        });
    }

    onKeyDown(e) {
        if (e.keyCode === 13) {
            if (e.shiftKey) {
                return;
            } else {
                this.socket.emit('message', this.inputBox.current.value);
                this.inputBox.current.value = '';
            }

            e.preventDefault();
        }
    }

    copyLink(e) {
        const btn = e.target;
        const link = document.location.origin + '/?room=' + this.room;
        navigator.clipboard.writeText(link).then(() => {
            btn.innerText = 'Done!';
        }).catch(() => {
            btn.innerText = 'Error :(';
        }).finally(() => {
            setTimeout(() => {
                btn.innerText = 'Copy link';
            }, 5000);
        });
    }

    render() {
        return (
            <div className='chat'>
                <div className='chat-menu'>
                    <div className='userlist'>
                        {this.state.users && this.state.users.map(user =>
                            <div key={user} className='user'>{user}</div>   
                        )}
                    </div>
                    <div onClick={this.copyLink} className='copy-link-button'>Copy link</div>
                </div>
                <div className='chat-texting'>
                    <div className='messages' ref={this.messagesBox}>
                        { this.state.messages && this.state.messages.map(m => 
                            <Message key={m.time} {...m} />
                        )}
                    </div>
                    <div className='input-box'>
                        <textarea ref={this.inputBox} placeholder='Input your message'/>
                    </div>
                </div>
            </div>
        );
    }
}

Chat.propTypes = {
    server: PropTypes.string,
    port: PropTypes.number,
    login: PropTypes.string,
    room: PropTypes.string
};

export default Chat;
