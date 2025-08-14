import React, { useState, useEffect, useRef } from "react";
import "../../styles/calculator.css";

// Hook for smooth number animation
function useAnimatedNumber(value, duration = 500, animate = true) {
  const [displayValue, setDisplayValue] = useState(value);
  const startValue = useRef(value);
  const startTime = useRef(null);

  useEffect(() => {
    if (!animate) {
      setDisplayValue(value);
      return;
    }

    startValue.current = displayValue;
    startTime.current = null;

    const step = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const newValue =
        startValue.current + (value - startValue.current) * progress;
      setDisplayValue(newValue);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration, animate]);

  return displayValue;
}

// Smooth slider
const SmoothSlider = ({ value, min, max, step, onChange }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let frame;
    const stepAnim = () => {
      setDisplayValue((prev) => {
        const diff = value - prev;
        if (Math.abs(diff) < 0.01) return value;
        return prev + diff * 0.15;
      });
      frame = requestAnimationFrame(stepAnim);
    };
    stepAnim();
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={displayValue}
      onChange={onChange}
      className="range-slider"
    />
  );
};

const Calculator = () => {
  const [accountValue, setAccountValue] = useState(100000);
  const [riskPerTrade, setRiskPerTrade] = useState(2.2);
  const [entryPrice, setEntryPrice] = useState(100.0);
  const [stopPrice, setStopPrice] = useState(80.0);
  const [sharesToBuy, setSharesToBuy] = useState(110.0);
  const [entryInput, setEntryInput] = useState(entryPrice.toFixed(2)); // String state for Entry Price input
  const [stopInput, setStopInput] = useState(stopPrice.toFixed(2)); // String state for Stop Price input
  const [entryFocused, setEntryFocused] = useState(false); // Track focus state for Entry Price
  const [stopFocused, setStopFocused] = useState(false); // Track focus state for Stop Price

  const [animateFields, setAnimateFields] = useState({
    accountValue: false,
    riskPerTrade: false,
    entryPrice: false,
    stopPrice: false,
  });

  // Animated values
  const animatedAccountValue = useAnimatedNumber(
    accountValue,
    400,
    animateFields.accountValue
  );
  const animatedRiskPerTrade = useAnimatedNumber(
    riskPerTrade,
    400,
    animateFields.riskPerTrade
  );
  const animatedEntryPrice = useAnimatedNumber(
    entryPrice,
    400,
    animateFields.entryPrice
  );
  const animatedStopPrice = useAnimatedNumber(
    stopPrice,
    400,
    animateFields.stopPrice
  );
  const animatedSharesToBuy = useAnimatedNumber(sharesToBuy, 400, true);

  const calculateShares = () => {
    if (!accountValue || !entryPrice || !stopPrice) return;
    const riskAmount = (Number(accountValue) * riskPerTrade) / 100;
    const riskPerShare = entryPrice - stopPrice;
    const shares = riskAmount / riskPerShare;
    setSharesToBuy(Number(shares.toFixed(1)));
  };

  useEffect(() => {
    calculateShares();
  }, [accountValue, riskPerTrade, entryPrice, stopPrice]);

  // Update input strings when the corresponding price changes (e.g., via slider)
  useEffect(() => {
    if (!entryFocused) {
      setEntryInput(entryPrice.toFixed(2));
    }
  }, [entryPrice, entryFocused]);

  useEffect(() => {
    if (!stopFocused) {
      setStopInput(stopPrice.toFixed(2));
    }
  }, [stopPrice, stopFocused]);

  // Handle input change for Entry Price
  const handleEntryInputChange = (e) => {
    const val = e.target.value.replace(/[^0-9.]/g, "");
    // Allow only one decimal point and up to two decimal places
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(val)) {
      setEntryInput(val);
    }
  };

  // Handle input blur for Entry Price
  const handleEntryInputBlur = () => {
    setEntryFocused(false);
    const val = parseFloat(entryInput);
    if (!isNaN(val)) {
      setEntryPrice(val);
      setEntryInput(val.toFixed(2)); // Format to two decimal places after blur
      setAnimateFields((prev) => ({ ...prev, entryPrice: false }));
    } else {
      setEntryPrice(0);
      setEntryInput("0.00");
    }
  };

  // Handle input change for Stop Price
  const handleStopInputChange = (e) => {
    const val = e.target.value.replace(/[^0-9.]/g, "");
    // Allow only one decimal point and up to two decimal places
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(val)) {
      setStopInput(val);
    }
  };

  // Handle input blur for Stop Price
  const handleStopInputBlur = () => {
    setStopFocused(false);
    const val = parseFloat(stopInput);
    if (!isNaN(val)) {
      setStopPrice(val);
      setStopInput(val.toFixed(2)); // Format to two decimal places after blur
      setAnimateFields((prev) => ({ ...prev, stopPrice: false }));
    } else {
      setStopPrice(0);
      setStopInput("0.00");
    }
  };

  return (
    <div className="md:w-[560px] min-h-[674px] m-2 md:p-[30px] flex flex-col xl:p-[50px] rounded-[7px] bg-white p-5 border border-[#E5E5E7]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5 w-full">

        {/* Account Value */}
        <div className="text-center w-[70%] mx-auto md:w-[193px] p-2 md:p-[14px] flex flex-col gap-[14px]">
          <label className="block text-sm md:text-[15px] font-semibold text-[#000000]">
            Account Value $
          </label>
          <span className="block text-[10px] md:text-[13px] font-medium text-[#000000] opacity-70">
            What have you in your trading account.
          </span>
          <input
            type="text"
            value={`$${Number(animatedAccountValue).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}`}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9.]/g, "");
              setAccountValue(val === "" ? "" : Number(val));
              setAnimateFields((prev) => ({ ...prev, accountValue: false }));
            }}
            onWheel={(e) => e.target.blur()}
            className="w-full text-center font-bold text-xl md:text-[30px] text-[#000000] outline-none bg-transparent letter_spacing"
          />
          <SmoothSlider
            min="0"
            max="120000"
            step="1"
            value={accountValue || 0}
            onChange={(e) => {
              setAccountValue(Number(e.target.value));
              setAnimateFields((prev) => ({ ...prev, accountValue: true }));
            }}
          />
        </div>

        {/* Risk Per Trade */}
        <div className="text-center w-[70%] mx-auto md:w-[193px] p-2 md:p-[14px] flex flex-col gap-[14px]">
          <label className="block text-sm md:text-[15px] font-semibold text-[#000000]">
            Risk Per Trade
          </label>
          <span className="block text-[10px] md:text-[13px] font-medium text-[#000000] opacity-70">
            How much you're willing to risk on one trade.
          </span>
          <div className="relative w-full">
            <input
              type="text"
              value={`${animatedRiskPerTrade.toFixed(1)}`}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.]/g, "");
                setRiskPerTrade(val === "" ? "" : parseFloat(val));
                setAnimateFields((prev) => ({ ...prev, riskPerTrade: false }));
              }}
              onWheel={(e) => e.target.blur()}
              className="w-full text-center letter_spacing font-bold text-xl md:text-[30px] text-[#000000] outline-none bg-transparent no-arrows pr-6"
            />
            <span className="absolute right-[25%] top-1/2 -translate-y-1/2 text-xl md:text-[30px] font-bold text-[#000000] pointer-events-none">
              %
            </span>
          </div>
          <SmoothSlider
            min="0"
            max="3"
            step="0.1"
            value={riskPerTrade || 0}
            onChange={(e) => {
              setRiskPerTrade(parseFloat(e.target.value));
              setAnimateFields((prev) => ({ ...prev, riskPerTrade: true }));
            }}
          />
        </div>

        {/* Entry Price */}
        <div className="text-center w-[70%] mx-auto md:w-[193px] p-2 md:p-[14px] flex flex-col gap-[14px]">
          <label className="block text-sm md:text-[15px] font-semibold text-[#000000]">
            Entry $
          </label>
          <span className="block text-[10px] md:text-[13px] font-medium text-[#000000] opacity-70">
            The price at which you plan to buy the asset.
          </span>
          <input
            type="text"
            value={entryFocused ? entryInput : `$${animatedEntryPrice.toFixed(2)}`}
            onChange={handleEntryInputChange}
            onFocus={() => setEntryFocused(true)}
            onBlur={handleEntryInputBlur}
            onWheel={(e) => e.target.blur()}
            className="w-full letter_spacing text-center font-bold text-xl md:text-[30px] text-[#000000] outline-none bg-transparent"
          />
          <SmoothSlider
            min="0"
            max="120"
            step="0.01"
            value={entryPrice || 0}
            onChange={(e) => {
              setEntryPrice(parseFloat(e.target.value));
              setAnimateFields((prev) => ({ ...prev, entryPrice: true }));
            }}
          />
        </div>

        {/* Stop Price */}
        <div className="text-center w-[70%] mx-auto md:w-[193px] p-2 md:p-[14px] flex flex-col gap-[14px]">
          <label className="block text-sm md:text-[15px] font-semibold text-[#000000]">
            Stop $
          </label>
          <span className="block text-[10px] md:text-[13px] font-medium text-[#000000] opacity-70">
            The price where you will exit to limit your loss.
          </span>
          <input
            type="text"
            value={stopFocused ? stopInput : `$${animatedStopPrice.toFixed(2)}`}
            onChange={handleStopInputChange}
            onFocus={() => setStopFocused(true)}
            onBlur={handleStopInputBlur}
            onWheel={(e) => e.target.blur()}
            className="w-full letter_spacing text-center font-bold text-xl md:text-[30px] text-[#000000] outline-none bg-transparent"
          />
          <SmoothSlider
            min="0"
            max="100"
            step="0.01"
            value={stopPrice || 0}
            onChange={(e) => {
              setStopPrice(parseFloat(e.target.value));
              setAnimateFields((prev) => ({ ...prev, stopPrice: true }));
            }}
          />
        </div>
      </div>

      {/* Button Click Calculation */}
      <div
        className="text-center text-2xl text-blue-500 cursor-pointer my-5"
        onClick={calculateShares}
      >
        <img src="/btn.png" alt="" className="mx-auto" />
      </div>

      {/* Shares To Buy */}
      <div className="text-center bg-white rounded-[17px] p-4 mt-5 w-[182px] min-h-[115px] border border-[#E3E3E8] box_shadow mx-auto flex flex-col justify-center items-center">
        <h3 className="text-sm md:text-[15px] text-[#000000] font-semibold mb-1 letter_spacing">
          Shares To Buy
        </h3>
        <p className="text-2xl md:text-[30px] font-bold text-[#000000]">
          {animatedSharesToBuy.toLocaleString(undefined, {
            maximumFractionDigits: 1,
          })}
        </p>
      </div>
    </div>
  );
};

export default Calculator;