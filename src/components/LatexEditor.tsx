import { useEffect, useRef, useState } from "react";
import MathInput from "react-math-keyboard";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

interface MathFieldConfig {
  typingAsteriskWritesTimesSymbol?: boolean;
  spaceBehavesLikeTab?: boolean;
  leftRightIntoCmdGoes?: "up" | "down";
  restrictMismatchedBrackets?: boolean;
  sumStartsWithNEquals?: boolean;
  supSubsRequireOperand?: boolean;
  charsThatBreakOutOfSupSub?: string;
  autoSubscriptNumerals?: boolean;
  autoCommands?: string;
  autoOperatorNames?: string;
  substituteTextarea?: () => void;
  handlers?: {
    deleteOutOf?: (direction: Direction, mathField: MathField) => void;
    moveOutOf?: (direction: Direction, mathField: MathField) => void;
    selectOutOf?: (direction: Direction, mathField: MathField) => void;
    downOutOf?: (mathField: MathField) => void;
    upOutOf?: (mathField: MathField) => void;
    edit?: (mathField: MathField) => void;
    enter?: (mathField: MathField) => void;
  };
  maxDepth?: number;
}
declare enum Direction {
  R = 0,
  L = 1,
}
interface MathField {
  revert(): void;
  reflow(): void;
  el(): HTMLElement;
  latex(): string;
  latex(latexString: string): void;
  text(): string;
  focus(): void;
  blur(): void;
  write(latex: string): void;
  cmd(latexString: string): void;
  select(): void;
  clearSelection(): void;
  moveToLeftEnd(): void;
  moveToRightEnd(): void;
  keystroke(keys: string): void;
  typedText(text: string): void;
  config(newConfig: MathFieldConfig): void;
  id: number;
}

const LatexEditor = () => {
  const firstMathfieldRef = useRef<MathField>();
  const [value1, setValue1] = useState<string>("");

  const clear = () => {
    if (firstMathfieldRef && firstMathfieldRef.current) {
      firstMathfieldRef.current.latex("");
      setValue1("");
    }
  };

  const setInitialLatex = (initialLatex: string) => {
    firstMathfieldRef.current?.latex(initialLatex);
    setValue1(initialLatex);
  };

  useEffect(() => {
    if (firstMathfieldRef.current) {
      firstMathfieldRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(value1);
    }
  }, [value1]);

  useEffect(() => {
    // Listen for messages from React Native WebView
    const handleMessage = (event: MessageEvent) => {
      const { type, value } = event.data;
      if (type === "setLatex") {
        setInitialLatex(value);
      } else if (type === "clearLatex") {
        clear();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <>
      <MathInput
        initialLatex=""
        setValue={setValue1}
        setMathfieldRef={(mathfield: MathField) =>
          (firstMathfieldRef.current = mathfield)
        }
        lang="en"
      />
      <button onClick={clear}>Clear</button>
    </>
  );
};

export default LatexEditor;
