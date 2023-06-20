import { Router } from "../deps.ts";
import { addRoutes } from "../router.ts";
const router = new Router();

router.get("/", async (ctx) => {
  const response = await fetch(
    "https://query1.finance.yahoo.com/v8/finance/chart/000001.SS?region=US&lang=en-US&includePrePost=false&interval=1d&useYfid=true&range=1y&corsDomain=finance.yahoo.com&.tsrc=finance"
  );
  const json = await response.json();
  const result = json.chart.result[0];

  const pricesOfDays: {
    [key: number]: {
      date: Date;
      close: number;
      open: number;
      high: number;
      low: number;
      volume: number;
    }[];
  } = {};
  for (let i = 0; i < result.timestamp.length; i++) {
    const date = new Date(result.timestamp[i] * 1000);
    const day = date.getDay();
    const close = result.indicators.quote[0].close[i];
    const open = result.indicators.quote[0].open[i];
    const high = result.indicators.quote[0].high[i];
    const low = result.indicators.quote[0].low[i];
    const volume = result.indicators.quote[0].volume[i];
    pricesOfDays[day] = pricesOfDays[day] || [];
    pricesOfDays[day].push({
      date,
      close,
      open,
      high,
      low,
      volume,
    });
  }
  const summaryOfDays: {
    [key: number]: {
      averageClosePrice: number;
      tp90ClosePrice: number;
      days: number;
    };
  } = {};
  for (const day in pricesOfDays) {
    const prices = pricesOfDays[day];
    const averageClosePrice =
      prices.reduce((sum, price) => sum + price.close, 0) / prices.length;
    const tp90ClosePrice = prices.sort((a, b) => b.close - a.close)[
      Math.floor(prices.length * 0.1)
    ].close;
    summaryOfDays[day] = {
      averageClosePrice,
      tp90ClosePrice,
      days: prices.length,
    };
  }

  const whichDayShouldIBuyIn = Object.entries(summaryOfDays).sort(
    (a, b) => a[1].averageClosePrice - b[1].averageClosePrice
  )[0][0];

  ctx.response.body = {
    whichDayShouldIBuyIn,
    summaryOfDays
  };
});

addRoutes(import.meta.url, router);
