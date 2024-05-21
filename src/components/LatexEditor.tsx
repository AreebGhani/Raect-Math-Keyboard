import { useEffect, useRef, useState } from "react";
import MathInput from "react-math-keyboard";

const LatexEditor = () => {
  const firstMathfieldRef = useRef<any>();
  const [value1, setValue1] = useState("[ int_0^1 x^2 e^x , dx ]  ");

  const clear = () => {
    firstMathfieldRef.current?.latex("");
    setValue1("");
  };

  const setInitialLatex = (initialLatex: any) => {
    firstMathfieldRef.current?.latex(initialLatex);
    setValue1(initialLatex);
  };

  useEffect(() => {
    // Send Latex value to the React Native WebView
    window.ReactNativeWebView?.postMessage(value1);
  }, [value1]);

  useEffect(() => {
    // Listen for messages from React Native WebView
    const handleMessage = (event) => {
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
        setMathfieldRef={(mathfield: any) =>
          (firstMathfieldRef.current = mathfield)
        }
        lang="en"
      />
      <button onClick={() => clear()}>Clear</button>
    </>
  );
};

export default LatexEditor;
