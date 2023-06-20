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
      rateOfReturn: number;
      days: number;
    };
  } = {};
  const latestPrice = result.indicators.quote[0].close.pop();
  for (const day in pricesOfDays) {
    const prices = pricesOfDays[day];
    const averageClosePrice =
      prices.reduce((sum, price) => sum + price.close, 0) / prices.length;
    // Compute how much money you would have made if you bought in on each day
    // and sold on the last day.
    const rateOfReturn = latestPrice / averageClosePrice - 1;

    summaryOfDays[day] = {
      averageClosePrice,
      rateOfReturn,
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
