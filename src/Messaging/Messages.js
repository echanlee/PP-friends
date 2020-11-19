import React from 'react';
import io from "socket.io-client";
import {withRouter, Link} from 'react-router-dom'
import {getCookie} from '../cookies';
import "./Messages.css";
import Header from '../Header/Header';

let endPoint = "http://localhost:5000";
let socket = io.connect(`${endPoint}`);

class Messages extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        userId: getCookie("userId"),
        messages : [],
        messageSender: [],
        timeStamps: [],
        message :"",
        room: this.props?.location?.state?.friendConvoId,
        currentName: this.props?.location?.state?.currentName,
        friendName: this.props?.location?.state?.friendName,
        friendId:  this.props?.location?.state?.friendId,
        currentConvoId: this.props?.location?.state?.currentConvoId,
    }
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentDidMount = () => {
    const currentConvoId = this.state.currentConvoId;
    const myRequest = new Request('http://127.0.0.1:5000/getMessages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"convoId": currentConvoId,})
            ,});
        fetch(myRequest)
            .then(response => response.json())
            .then(res => {
                this.setState({
                    messages: res.messages,
                    messageSender: res.fromNames,
                    timeStamps: res.timeStamps,
                  });

                  socket.emit("room", currentConvoId);
                  socket.on("message", msg => {
                    this.setState({
                        messages: [...this.state.messages, msg],
                        messageSender: [...this.state.messageSender, this.state.friendName],
                        timeStamps: [...this.state.timeStamps, new Date().toUTCString()],
                      });
                  this.scrollToBottom();
                });
            })
        .catch((error) => {
            console.error(error)
        });
  };


  // On Change
  onChange = e => {
    this.setState({
      message: e.target.value
    });
  };

  // On Click
  onClick = () => {
    const message = this.state.message;
    const name = this.state.currentName;
    const room = this.state.room;
    const currentConvoId = this.state.currentConvoId;
    if (message !== "") {
      socket.emit("message", 
        {
          msg: (message),
          room: room,
        }
      );
      const myRequest = new Request('http://127.0.0.1:5000/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "convoId": currentConvoId,
                "friendConvoId": this.state.room,
                "currentId": this.state.userId,
                "friendId": this.state.friendId,
                "message": message
            }),});
        fetch(myRequest)
            .then(response => response.json())
            .then(res => {
                if(res.response != "Success")
                    alert("Something went wrong sending message");
            })
        .catch((error) => {
            console.error(error)
        });
      const date = new Date();
      this.setState({
        messages: [...this.state.messages, message],
        messageSender: [...this.state.messageSender, name],
        timeStamps: [...this.state.timeStamps, date.toUTCString()],
        message: "",
      });
    } else {
      alert("Please Add A Message");
    }
  };

  onKeyPress = (e) => {
    if(e.which === 13) {
      this.onClick();
    }
  }

  render() {
    if(this.state.userId === "") {
      this.props.history.push({
        pathname: "/login",
      });
      return null;
  }

    var message = this.state.message;
    var messages = this.state.messages;
    var timeStamps = this.state.timeStamps;
    var names = this.state.messageSender;
    return (
      <div>
        <Header id={this.state.id}/>
      <div className = "PageContainer">
        <p>You are currently messaging:</p>
         <h1>{this.state.friendName}</h1>
        <div className = "MessageContainer">
        {messages.length > 0 ?
          messages.map((msg, index) => (
             names[index]==this.state.currentName ?
              <div className = "UserOne">
                <p1>{timeStamps[index]}</p1>
                <p>{names[index]} : {msg}</p>
              </div> :
              <div className = "UserTwo">
                <p1>{timeStamps[index]}</p1>
                <p>{names[index]} : {msg}</p>
              </div>
            )):
          <p>Start a conversation!</p>}

          <div style={{ float:"left", clear: "both" }}
            ref={(el) => { this.messagesEnd = el; }}>
          </div>
          
          <input value={message} name="message" onChange={e => this.onChange(e)} onKeyPress={this.onKeyPress} />
          <button onClick={() =>this.onClick()} >Send Message</button> <br></br>
            
        </div>  
      </div>
      </div>
    );
    }
}


export default withRouter(Messages);