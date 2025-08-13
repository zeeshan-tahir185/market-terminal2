import React, { useState, useEffect } from 'react';
import '../../styles/calculator.css';

const SmoothSlider = ({ value, min, max, step, onChange }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let frame;
    const stepAnim = () => {
      setDisplayValue((prev) => {
        const diff = value - prev;
        if (Math.abs(diff) < 0.01) return value;
        return prev + diff * 0.08; // slower animation
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
  const [sharesToBuy, setSharesToBuy] = useState(100000);

  const calculateShares = () => {
    if (!accountValue || !entryPrice || !stopPrice) return;
    const riskAmount = (Number(accountValue) * riskPerTrade) / 100;
    const riskPerShare = entryPrice - stopPrice;
    if (riskPerShare > 0) {
      const shares = riskAmount / riskPerShare;
      setSharesToBuy(Math.floor(shares));
    } else {
      setSharesToBuy(0);
    }
  };

  // Auto calculate when inputs change
  useEffect(() => {
    calculateShares();
  }, [accountValue, riskPerTrade, entryPrice, stopPrice]);

  return (
    <div className="md:w-[560px] min-h-[674px] m-2 md:p-[30px] flex flex-col xl:p-[50px] rounded-[7px] bg-white p-5 border border-[#E5E5E7]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5 w-full">

        {/* Account Value */}
        <div className="text-center w-[70%] mx-auto md:w-[193px] p-2 md:p-[14px] flex flex-col gap-[14px]">
          <label className="block text-sm md:text-[15px] font-semibold text-[#000000] ">
            Account Value $
          </label>
          <span className="block text-[10px] md:text-[13px] font-medium text-[#000000] opacity-70">
            What have you in your trading account.
          </span>
          <input
            type="text"
            value={accountValue === '' ? '' : `$${Number(accountValue).toLocaleString()}`}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9.]/g, '');
              if (val === '') {
                setAccountValue('');
              } else {
                setAccountValue(Number(val));
              }
            }}
            onWheel={(e) => e.target.blur()}
            className="w-full text-center font-bold text-xl md:text-[30px] text-[#000000] outline-none bg-transparent letter_spacing"
          />
          <SmoothSlider
            min="0"
            max="120000"
            step="1"
            value={accountValue || 0}
            onChange={(e) => setAccountValue(Number(e.target.value))}
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
              type="number"
              value={riskPerTrade}
              onChange={(e) => setRiskPerTrade(parseFloat(e.target.value) || 0)}
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
            value={riskPerTrade}
            onChange={(e) => setRiskPerTrade(parseFloat(e.target.value))}
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
            value={entryPrice === '' ? '' : `$${entryPrice}`}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9.]/g, '');
              if (val === '') {
                setEntryPrice('');
              } else {
                setEntryPrice(parseFloat(val));
              }
            }}
            onWheel={(e) => e.target.blur()}
            className="w-full letter_spacing text-center font-bold text-xl md:text-[30px] text-[#000000] outline-none bg-transparent"
          />
          <SmoothSlider
            min="0"
            max="120"
            step="0.01"
            value={entryPrice || 0}
            onChange={(e) => setEntryPrice(parseFloat(e.target.value))}
          />
        </div>

        {/* Stop Price */}
        <div className="text-center w-[70%] mx-auto md:w-[193px] p-2 md:p-[14px] flex flex-col gap-[14px]">
          <label className="block text-sm md:text-[15px] font-semibold text-[#000000] ">
            Stop $
          </label>
          <span className="block text-[10px] md:text-[13px] font-medium text-[#000000] opacity-70">
            The price where you will exit to limit your loss.
          </span>
          <input
            type="text"
            value={stopPrice === '' ? '' : `$${stopPrice}`}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9.]/g, '');
              if (val === '') {
                setStopPrice('');
              } else {
                setStopPrice(parseFloat(val));
              }
            }}
            onWheel={(e) => e.target.blur()}
            className="w-full letter_spacing text-center font-bold text-xl md:text-[30px] text-[#000000] outline-none bg-transparent"
          />
          <SmoothSlider
            min="0"
            max="100"
            step="0.01"
            value={stopPrice || 0}
            onChange={(e) => setStopPrice(parseFloat(e.target.value))}
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

      <div className="text-center bg-white rounded-[17px] p-4 mt-5 w-[182px] min-h-[115px] border border-[#E3E3E8] box_shadow mx-auto flex flex-col justify-center items-center">
        <h3 className="text-sm md:text-[15px] text-[#000000] font-semibold mb-1 letter_spacing">
          Shares To Buy
        </h3>
        <p className="text-2xl md:text-[30px] font-bold text-[#000000]">
          {sharesToBuy.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default Calculator;
