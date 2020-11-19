import React from "react";
import "./Matches.css";
import { withRouter, Link } from "react-router-dom";

class Matches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props?.location?.state?.id,
      userIds: [],
      matchesExist: "not set",
      firstnames: [],
      name: "",
    };
    this.selectUser = this.selectUser.bind(this);
  }
  selectUser(event) {
    const userSelected = event.target.value.split("|");
    const myRequest = new Request("http://127.0.0.1:5000/conversationId", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: this.state.userId,
        friendId: userSelected[0],
      }),
    });
    fetch(myRequest)
      .then((response) => response.json())
      .then((res) => {
        this.props.history.push({
          pathname: "/messages",
          state: {
            id: this.state.userId,
            friendId: userSelected[0],
            currentName: this.state.name,
            friendName: userSelected[1],
            currentConvoId: res.currentConvoId,
            friendConvoId: res.friendConvoId,
          },
        });
      })
      .catch((error) => {
        alert("Something went wrong");
        console.error(error);
      });
  }

  get_matches() {
    const myRequest = new Request("http://127.0.0.1:5000/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: this.state.userId }),
    });
    fetch(myRequest)
      .then((response) => response.json())
      .then((res) =>
        res.userIds && res.userIds.length != 0
          ? this.setState({
              matchesExist: "exists",
              userIds: res.userIds,
              firstnames: res.firstnames,
              name: res.currentName,
            })
          : this.setState({
              matchesExist: "not exists",
            })
      )
      .catch((error) => {
        console.error(error);
      });
  }
  componentDidMount() {
    this.get_matches();
  }
  componentDidUpdate(prevProps, prevState) {
    for (var i = 0; i < this.state.userIds.length; ++i) {
      if (this.state.userIds[i] != prevState.userIds[i]) {
        this.get_matches();
        break;
      }
    }
  }

  render() {
    let matchingSection;
    if (this.state.matchesExist == "exists") {
      let userItems = [];
      for (var i = 0; i < this.state.userIds.length; i++) {
        var pos_user = this.state.userIds[i];
        userItems.push(
          <button
            className="pos-user"
            key={pos_user}
            value={this.state.userIds[i] + "|" + this.state.firstnames[i]}
            onClick={this.selectUser}
          >
            {this.state.firstnames[i]}
          </button>
        );
      }
      matchingSection = (
        <h3 id="Matches-congrats">
          <img src="happy-penguin.svg"></img>
          <p>Congratulations, you have a match! </p>
          <div className="matchingBox">
            <br></br>
            <h2>{userItems}</h2>
            <br></br>
          </div>
        </h3>
      );
    } else if (this.state.matchesExist == "not exists") {
      matchingSection = (
        <h2 id="Matches-none">
          <img src="sad-penguin.svg"></img>
          <p>Sorry, no one met the matching criteria you set.</p>
          <p>
            We suggest you to edit your profile, or wait for more users to join
            our community.
          </p>
          <p>Please try again later!</p>
        </h2>
      );
    } else {
      matchingSection = <h2></h2>;
    }
    return (
      <div id="Matches-section">
        {matchingSection}

        <br></br>
        <div class="swipingButton" id="swipingButton">
          <Link to={{ pathname: "/main", state: { id: this.state.userId } }}>
            <p>Keep Swiping </p>
          </Link>
        </div>

        <br></br>
        <div class="viewProfileButton" id="viewProfileButton">
          <Link
            to={{ pathname: "/viewprofile", state: { id: this.state.userId } }}
          >
            <p> View Profile</p>
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(Matches);
