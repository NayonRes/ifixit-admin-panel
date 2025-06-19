import React from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";

const AreaChart = () => {
  const theme = useTheme();
  let state = {
    series: [
      // {
      //   name: "series1",
      //   data: [31, 40, 28, 51, 42, 109, 100],
      // },
      {
        name: "series2",
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: false, //download button hide
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: [theme.palette.warning.main],
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
      },
      fill: {
        opacity: 1,
        colors: [theme.palette.warning.main],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  };

  return (
    <div id="chart">
      <Chart
        options={state.options}
        series={state.series}
        type="area"
        height={215}
      />
    </div>
  );
};

export default AreaChart;
