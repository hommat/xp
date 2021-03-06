import React, { Component } from "react";

import withContext from "../../../hoc/withContext";
import CalculatorView from "./CalculatorView";
import config from "./config";
import { WindowContextType } from "ContextType";
import { areObjectsEqual } from "../../../utils";

export enum Operation {
  Add = 1,
  Subtract = 2,
  Multiple = 3,
  Divide = 4
}

type CtxProps = {
  window: WindowContextType;
};

type State = {
  displayText: string;
  memory: string | null;
  triedToDivideByZero: boolean;
  wrongFunctionArgument: boolean;
  groupNumbers: boolean;
};

const initState: State = {
  displayText: "0",
  memory: null,
  triedToDivideByZero: false,
  wrongFunctionArgument: false,
  groupNumbers: false
};

const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export class CalculatorContainer extends Component<CtxProps, State> {
  private wasTextCleared: boolean = true;

  private lastOperation: Operation | null = null;
  private lastNumber: number = 0;

  readonly state: State = initState;

  shouldComponentUpdate(_: CtxProps, nextState: State) {
    return !areObjectsEqual(this.state, nextState, Object.keys(this.state));
  }

  componentDidMount() {
    window.addEventListener("keydown", this.keyListener);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.keyListener);
  }

  keyListener = ({ key, ctrlKey }: KeyboardEvent) => {
    const { window } = this.props;
    if (!window.focused || window.disabled) return;

    if (ctrlKey) {
      if (key === "p" || key === "P") this.memoryAdd();
      else if (key === "l" || key === "L") this.clearMemory();
      else if (key === "r" || key === "R") this.memoryRecall();
      else if (key === "m" || key === "M") this.memoryStore();

      return;
    }

    if (nums.indexOf(key) > -1) {
      this.handleValueClick({ currentTarget: { textContent: key } } as any);
    } else if (key === "," || key === ".") this.dot();
    else if (key === "Enter") this.equal();
    else if (key === "+") this.add();
    else if (key === "-") this.subtract();
    else if (key === "*") this.multiple();
    else if (key === "/") this.divide();
    else if (key === "%") this.percent();
    else if (key === "r" || key === "R") this.inverse();
    else if (key === "F9") this.opposite();
    else if (key === "@") this.squareRoot();
    else if (key === "Backspace") this.backspace();
    else if (key === "c" || key === "C") this.clearAll();
    else if (key === "Delete") this.clear();
  };

  clearMemory = () => {
    this.setState({ memory: null });
  };

  memoryRecall = () => {
    const { memory } = this.state;

    if (memory === null) this.setState({ displayText: "0" });
    else this.setState({ displayText: memory });
  };

  memoryStore = () => {
    this.setState(({ displayText }) => ({ memory: displayText }));
  };

  memoryAdd = () => {
    const { memory, displayText } = this.state;

    if (memory === null) this.setState({ memory: displayText });
    else {
      const added: number = parseFloat(displayText) + parseFloat(memory);
      this.setState({ memory: added.toString() });
    }
  };

  backspace = () => {
    if (!this.wasTextCleared) return;

    const { displayText } = this.state;
    const { length } = displayText;
    const isMinus = displayText[0] === "-";

    if ((length > 2 && isMinus) || (length > 1 && !isMinus)) {
      const newDisplayText = displayText.substring(0, length - 1);
      this.setState({ displayText: newDisplayText });
    } else this.setState({ displayText: "0" });
  };

  clearAll = () => {
    this.wasTextCleared = true;
    this.lastOperation = null;
    this.lastNumber = 0;

    const { memory, groupNumbers, ...rest } = initState;
    this.setState({ ...rest });
  };

  clear = () => {
    this.setState({ displayText: "0" });
  };

  handleValueClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    const { textContent } = e!.currentTarget;

    if (this.wasTextCleared) this.addDigitToDisplayText(textContent!);
    else this.startNewDisplayText(textContent!);
  };

  addDigitToDisplayText = (buttonValue: string) => {
    const { displayText } = this.state;
    if (displayText.length >= config.maxTextLength) return;

    let newDisplayText: string = "";

    if (displayText === "0") newDisplayText = buttonValue!;
    else newDisplayText = displayText + buttonValue;

    this.setState({ displayText: newDisplayText });
  };

  startNewDisplayText = (buttonValue: string) => {
    const parsedDisplay = parseFloat(this.state.displayText);

    this.lastNumber = parsedDisplay;
    this.wasTextCleared = true;

    this.setState({ displayText: buttonValue });
  };

  add = () => this.handleOperationClick(Operation.Add);

  subtract = () => this.handleOperationClick(Operation.Subtract);

  multiple = () => this.handleOperationClick(Operation.Multiple);

  divide = () => this.handleOperationClick(Operation.Divide);

  handleOperationClick = (operation: Operation) => {
    this.equal();
    this.lastOperation = operation;
    this.wasTextCleared = false;
  };

  equal = () => {
    if (!this.lastOperation || !this.wasTextCleared) return;

    const newNumber = this.getOperationResult();
    this.wasTextCleared = false;
    this.lastOperation = null;

    const newNumberAsString = newNumber!.toString();
    this.setState({ displayText: newNumberAsString });
  };

  getOperationResult = (): number => {
    const currentNumber = parseFloat(this.state.displayText);
    let result = 0;
    switch (this.lastOperation) {
      case Operation.Add:
        result = this.lastNumber + currentNumber;
        break;
      case Operation.Subtract:
        result = this.lastNumber - currentNumber;
        break;
      case Operation.Multiple:
        result = this.lastNumber * currentNumber;
        break;
      case Operation.Divide:
        if (currentNumber === 0) {
          this.setState({ triedToDivideByZero: true });
          result = 0;
        } else result = this.lastNumber / currentNumber;
        break;
      default:
        throw Error("Operation failed");
    }

    return parseFloat(result.toFixed(config.fixedDigits));
  };

  squareRoot = () => {
    const { displayText } = this.state;
    const displayNumber = parseFloat(displayText);
    const sqaureRooted = Math.sqrt(displayNumber);
    if (displayNumber < 0) this.setState({ wrongFunctionArgument: true });
    this.setFloatPointNumberIntoDisplayText(sqaureRooted);
  };

  opposite = () => {
    let newDisplayText = this.state.displayText;

    if (newDisplayText[0] === "-") newDisplayText = newDisplayText.substring(1);
    else newDisplayText = "-" + newDisplayText;

    this.setState({ displayText: newDisplayText });
  };

  inverse = () => {
    const { displayText } = this.state;
    const displayNumber = parseFloat(displayText);
    const inversed = 1 / displayNumber;
    if (displayNumber === 0) this.setState({ triedToDivideByZero: true });
    this.setFloatPointNumberIntoDisplayText(inversed);
  };

  percent = () => {
    const { lastOperation, wasTextCleared, lastNumber } = this;
    const { Add, Subtract } = Operation;
    const isOperProper = lastOperation === Add || lastOperation === Subtract;

    if (wasTextCleared && isOperProper) {
      const currentNumber = parseFloat(this.state.displayText);
      const newNumber = lastNumber * (currentNumber / 100);
      this.setFloatPointNumberIntoDisplayText(newNumber);
    }
  };

  setFloatPointNumberIntoDisplayText = (num: number) => {
    const newDisplayText = parseFloat(
      num.toFixed(config.fixedDigits)
    ).toString();

    this.setState({ displayText: newDisplayText });
  };

  dot = () => {
    if (!this.wasTextCleared) {
      this.startNewDisplayText("0.");
      return;
    }

    const { displayText } = this.state;

    if (displayText.indexOf(".") === -1) {
      this.setState({ displayText: displayText + "." });
    }
  };

  toggleGroupNumbers = () => {
    this.setState(({ groupNumbers }) => ({ groupNumbers: !groupNumbers }));
  };

  render() {
    return (
      <CalculatorView
        {...this.state}
        onAddClick={this.add}
        onBackspaceClick={this.backspace}
        onClearAllClick={this.clearAll}
        onClearClick={this.clear}
        onClearMemoryClick={this.clearMemory}
        onDivideClick={this.divide}
        onDotClick={this.dot}
        onEqualClick={this.equal}
        onInverseClick={this.inverse}
        onMemoryAddClick={this.memoryAdd}
        onMemoryRecallClick={this.memoryRecall}
        onMemoryStoreClick={this.memoryStore}
        onMultipleClick={this.multiple}
        onOppositeClick={this.opposite}
        onPercentClick={this.percent}
        onSquareRootClick={this.squareRoot}
        onSubtractClick={this.subtract}
        onValueClick={this.handleValueClick}
        onGroupNumberClick={this.toggleGroupNumbers}
        data-test="view"
      />
    );
  }
}

export default withContext(CalculatorContainer, "window");
