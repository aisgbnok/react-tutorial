import React from "react";
import ReactDOM from "react-dom";
import {
  DefaultButton,
  PrimaryButton,
  IconButton,
} from "@fluentui/react/lib/Button";
import { registerIcons } from "@fluentui/react/lib/Styling";
import { Text } from "@fluentui/react/lib/Text";
import "./index.scss";

registerIcons({
  icons: {
    "dismiss-svg": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M4.39705 4.55379L4.46967 4.46967C4.73594 4.2034 5.1526 4.1792 5.44621 4.39705L5.53033 4.46967L12 10.939L18.4697 4.46967C18.7626 4.17678 19.2374 4.17678 19.5303 4.46967C19.8232 4.76256 19.8232 5.23744 19.5303 5.53033L13.061 12L19.5303 18.4697C19.7966 18.7359 19.8208 19.1526 19.6029 19.4462L19.5303 19.5303C19.2641 19.7966 18.8474 19.8208 18.5538 19.6029L18.4697 19.5303L12 13.061L5.53033 19.5303C5.23744 19.8232 4.76256 19.8232 4.46967 19.5303C4.17678 19.2374 4.17678 18.7626 4.46967 18.4697L10.939 12L4.46967 5.53033C4.2034 5.26406 4.1792 4.8474 4.39705 4.55379L4.46967 4.46967L4.39705 4.55379Z"
          fill="#212121"
        />
      </svg>
    ),
    "circle-svg": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"
          fill="#121212"
        />
      </svg>
    ),
  },
});

function Square(props) {
  const xIcon: IIconProps = { iconName: "dismiss-svg" };
  const oIcon: IIconProps = { iconName: "circle-svg" };

  let usedIcon, title, label;

  if (props.value == "X") {
    usedIcon = xIcon;
    title = "X";
    label = "X";
  } else if (props.value == "O") {
    usedIcon = oIcon;
    title = "O";
    label = "O";
  }

  return (
    <IconButton
      className="square"
      onClick={props.onClick}
      iconProps={usedIcon}
      title={title}
      ariaLabel={label}
    ></IconButton>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div className="board">
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Timeline extends React.Component {
  renderSnapshot(snapshotNumber, snapshotDesc) {
    if (snapshotNumber == 0) {
      return (
        <PrimaryButton
          key={snapshotNumber}
          onClick={() => this.props.onClick(snapshotNumber)}
        >
          {snapshotDesc}
        </PrimaryButton>
      );
    }
    return (
      <DefaultButton
        key={snapshotNumber}
        onClick={() => this.props.onClick(snapshotNumber)}
      >
        {snapshotDesc}
      </DefaultButton>
    );
  }

  render() {
    const title = "Timeline";
    const description =
      "Selecting a step will move you throughout the timeline.";
    const moves = this.props.history.map((step, move) => {
      const desc = move ? "Step " + move : "Reset";

      return this.renderSnapshot(move, desc);
    });

    return (
      <div className="game-info__section" id="timeline">
        <div className="header">
          <Text className="header__title" variant={"xLarge"}>
            {title}
          </Text>
          <Text className="header__description">{description}</Text>
        </div>
        <div id="snapshots">{moves}</div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  statusColor(statusState) {
    if(statusState == 'Game') {
      return(`tie`);
    } else if (statusState =='Winner') {
      return(`win`);
    } else {
      return(`next`);
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let statusMessage, statusState;
    if (winner == "T") {
      statusMessage = "Tie Game";
      statusState = "Game";
    } else if (winner) {
      statusMessage = winner;
      statusState = "Winner";
    } else {
      statusMessage = this.state.xIsNext ? "X" : "O";
      statusState = "Next Player";
    }

    return (
      <div
        className="main-wrapper mdc-top-app-bar--fixed-adjust"
        id="parent-wrapper"
      >
        <div className="main-wrapper main-wrapper__content" id="game-wrapper">
          <div className="main-wrapper" id="game-board-wrapper">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="main-wrapper" id="game-info-wrapper">
            <div className={`game-info__section ` + this.statusColor(statusState)} id="status">
              <Text className="game-info__status" variant={"xxLargePlus"}>
                {statusMessage}
              </Text>
              <Text
                className="game-info__status-state"
                variant={"mediumPlus"}
              >
                {statusState}
              </Text>
            </div>
            <Timeline history={history} onClick={(i) => this.jumpTo(i)} />
          </div>
        </div>
      </div>
    );
  }
}

class AppBar extends React.Component {
  render() {
    const appName = "Tic-Tac-Toe";

    return (
      <header className="mdc-top-app-bar mdc-top-app-bar--fixed">
        <div className="mdc-top-app-bar__row">
          <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
            <Text
              className="mdc-top-app-bar__title"
              key={"app-bar__title"}
              variant={"xLarge"}
              nowrap
              block
            >
              {appName}
            </Text>
          </section>
        </div>
      </header>
    );
  }
}

// ========================================

ReactDOM.render(
  <React.Fragment>
    <AppBar />
    <Game />
  </React.Fragment>,
  document.getElementById("root")
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      return null;
    }
  }
  return "T";
}
