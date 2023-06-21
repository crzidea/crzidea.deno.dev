import { Router } from "../deps.ts";
import { addRoutes } from "../router.ts";
const router = new Router();

router.get("/", async (ctx) => {
  const range = "1y";
  const response = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/000001.SS?region=US&lang=en-US&includePrePost=false&interval=1d&useYfid=true&range=${range}&corsDomain=finance.yahoo.com&.tsrc=finance`
  );
  const json = await response.json();
  const result = json.chart.result[0];

  const pricesOfDays: {
    [key: number]: {
      date: Date;
      close: number;
    }[];
  } = {};
  for (let i = 0; i < result.timestamp.length; i++) {
    const date = new Date(result.timestamp[i] * 1000);
    const day = date.getDay();
    const close = result.indicators.quote[0].close[i];
    pricesOfDays[day] = pricesOfDays[day] || [];
    pricesOfDays[day].push({
      date,
      close,
    });
  }
  const summaryOfDays: {
    [key: number]: {
      averageClosePrice: number;
      tp90ClosePriceForBuyIn: number;
      tp10ClosePriceForSellOut: number;
      rateOfReturn: number;
      days: number;
    };
  } = {};
  const latestPrice = result.indicators.quote[0].close.pop();
  for (const day in pricesOfDays) {
    const prices = pricesOfDays[day];
    const averageClosePrice =
      prices.reduce((sum, price) => sum + price.close, 0) / prices.length;
    const sortedPrices = prices
      .map((price) => price.close)
      .sort((a, b) => a - b);
    const tp90ClosePriceForBuyIn = sortedPrices[Math.floor(prices.length * 0.9)];
    const tp10ClosePriceForSellOut = sortedPrices[Math.floor(prices.length * 0.1)];
    // Compute how much money you would have made if you bought in on each day
    // and sold on the last day.
    const rateOfReturn = latestPrice / averageClosePrice - 1;

    summaryOfDays[day] = {
      averageClosePrice,
      tp90ClosePriceForBuyIn,
      tp10ClosePriceForSellOut,
      rateOfReturn,
      days: prices.length,
    };
  }

  const theDayShouldBuyInConsinderedWithAveragePrice = Object.entries(summaryOfDays).sort(
    (a, b) => a[1].averageClosePrice - b[1].averageClosePrice
  )[0][0];
  const theDayShouldBuyInConsideredWithTp90Price = Object.entries(summaryOfDays).sort(
    (a, b) => a[1].tp90ClosePriceForBuyIn - b[1].tp90ClosePriceForBuyIn
  )[0][0];
  const theDayShouldSellOutConsideredWithTp10Price = Object.entries(summaryOfDays).sort(
    (a, b) => b[1].tp10ClosePriceForSellOut - a[1].tp10ClosePriceForSellOut
  )[0][0];

  ctx.response.body = {
    latestDate: new Date(result.timestamp.pop() * 1000),
    theDayShouldBuyInConsinderedWithAveragePrice,
    theDayShouldBuyInConsideredWithTp90Price,
    theDayShouldSellOutConsideredWithTp10Price,
    summaryOfDays
  };
});

addRoutes(import.meta.url, router);
