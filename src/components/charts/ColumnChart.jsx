import React from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";

const ColumnChart = (chartData) => {
  console.log("chartData", chartData);
  const theme = useTheme();
  let state = {
    series: [
      {
        name: "Net Profit",
        data: [44, 55, 57, 56, 61, 58, 63],
      },
      // {
      //   name: "Revenue",
      //   data: [76, 85, 101, 98, 87, 105, 91],
      // },
      //   {
      //     name: "Free Cash Flow",
      //     data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      //   },
    ],
    options: {
      chart: {
        fontFamily: '"Roboto",sans-serif',

        toolbar: {
          show: false, //download button hide
        },
        type: "bar",
        // height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "35%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      //   stroke: {
      //     show: true,
      //     width: 2,
      //     colors: ["transparent"],
      //   },
      xaxis: {
        categories: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      },
      //   yaxis: {
      //     title: {
      //       text: "$ (thousands)",
      //     },
      //   },
      fill: {
        opacity: 1,
        colors: [theme.palette.primary.main],
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
    },
    minHeight: 250,
  };

  return (
    <div id="chart">
      <Chart
        options={state.options}
        series={state.series}
        type="bar"
        height={215}
      />
    </div>
  );
};

export default ColumnChart;
