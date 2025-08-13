import React from "react";

const ChartSection = () => {
  return (
    <div style={{  height: "620px" }}>
      <iframe
        title="TradingView Chart"
        src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=NASDAQ%3AAAPL&interval=D&hidesidetoolbar=0&hidetoptoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=Volume%40tv-basicstudies%1FMAExp%40tv-basicstudies%1FMAExp%40tv-basicstudies%1FMAExp%40tv-basicstudies&theme=Light&style=1&timezone=exchange&withdateranges=1&hideideas=1&studies_overrides=%7B%22volume.volume.color.0%22%3A%22%232962FF%22%2C%22volume.volume.color.1%22%3A%22%23ff2d8a%22%2C%22moving%20average.plot.color%22%3A%22%232962FF%22%2C%22moving%20average.plot.linewidth%22%3A2%7D"
        style={{
          width: "100%",
          height: "100%",
        //   border: "none",
        }}
        allowTransparency="true"
        scrolling="no"
      ></iframe>
    </div>
  );
};

export default ChartSection;
