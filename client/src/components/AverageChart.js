import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const AverageChart = () => {
  const [state, setState] = useState({
    data: null,
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });

  const getData = async () => {
    const config = {
      headers: {
        "x-auth-token": "",
      },
    };
    await axios
      .get("/api/event/eventInfo/0/5", config)
      .catch((err) => console.error(err))
      .then(async (eventData) => {
        var titles = [];
        let pointDataArray = [];
        console.log(eventData);
        const info = eventData.data[0];
        titles.push(info.title);

        //modify this route to send an array of objects
        // const body = JSON.stringify({});
        // await axios
        //   .get("/api/event/averagePoints", body, config)
        //   .then((pointData) => {
        //     const tableData = {
        //       labels: titles,
        //       datasets: [
        //         {
        //           label: "Average Points Per Event",
        //           data: pointDataArray,
        //           borderWidth: 2,
        //         },
        //       ],
        //     };
        //     setState({ ...state, data: tableData });
        //   })
        //   .catch((err) => console.error(err));
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="chart">
      {state.data != null ? (
        <div>
          <h1>{console.log(state)}</h1>
          <Bar data={state.data} options={state.options} />
        </div>
      ) : (
        <h1>{console.log(state)}</h1>
      )}
    </div>
  );
};

export default AverageChart;
