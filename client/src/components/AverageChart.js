import React, { Fragment, useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { LinearProgress } from "@material-ui/core";
import { UserContext } from "../UserContext";

const AverageChart = ({ numberOfEvents }) => {
  const { user, setUser } = useContext(UserContext);
  const [state, setState] = useState({
    data: null,
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              fontSize: 17,
            },
            scaleLabel: {
              display: true,
              labelString: "Points",
              fontSize: 30,
            },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Event",
              fontSize: 30,
            },
          },
        ],
      },
      title: {
        display: true,
        text: "Mean and Median Points Per Event",
        fontSize: 40,
      },
      legend: {
        display: true,
        position: "bottom",
        labels: {
          fontSize: 17,
        },
      },
    },
  });

  const getData = async () => {
    //need to update token value
    const config = {
      headers: {
        "x-auth-token": user.token,
      },
    };
    //gets all event data
    const eventData = await axios
      .get("/api/event/eventInfo/0/" + numberOfEvents, config)
      .catch((err) => console.error(err));
    var ids = [];
    var titles = [];
    if (eventData === undefined) {
      return;
    }

    eventData.data.map((eventInfo) => {
      titles.push(eventInfo.title);
      ids.push(eventInfo.uuid);
    });

    //gets all points data
    let meanDataArray = [];
    let medianDataArray = [];
    for (var i = 0; i < titles.length; i++) {
      const pointData = await axios
        .get("/api/event/averagePoints/" + ids[i], config)
        .catch((err) => console.error(err));
      meanDataArray.push(Math.trunc(pointData.data.meanPoints));
      medianDataArray.push(Math.trunc(pointData.data.medianPoints));
    }

    //inserts into graph and updates state
    const tableData = {
      labels: titles,
      datasets: [
        {
          label: "Mean Points of Attendees",
          data: meanDataArray,
          borderWidth: 2,
          backgroundColor: "#3E4857",
        },
        {
          label: "Median Points of Attendees",
          data: medianDataArray,
          borderWidth: 2,
        },
      ],
    };
    setState({ ...state, data: tableData });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="chart">
      {state.data == null && user.token == null ? (
        <Fragment>
          <LinearProgress />
          <Bar options={state.options} />
        </Fragment>
      ) : (
        <Bar data={state.data} options={state.options} />
      )}
    </div>
  );
};

export default AverageChart;
