"use client";
import React, { memo } from "react";

function BitcoinChart({containerRef}: {containerRef: React.RefObject<HTMLDivElement>}) {
  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div id="tradingview_1" />
    </div>
  );
}

export default memo(BitcoinChart);