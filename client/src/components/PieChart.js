import React, { Fragment, useContext, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { LinearProgress, MenuItem, Select } from "@material-ui/core";
import { UserContext } from "../UserContext";
import { sub, formatISO } from "date-fns";

const PieChart = () => {
  const { user } = useContext(UserContext);
  const [state, setState] = useState({
    data: null,
    options: {
      title: {
        display: true,
        text: "Suborg Events",
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
    numberOfEvents: 50,
    timePeriod: "week",
    displayType: "number",
  });

  const getDataNumber = async () => {
    //gets token
    const config = {
      headers: {
        "x-auth-token": user.token,
      },
    };
    //gets all event data
    const eventData = await axios
      .get("/api/event/eventInfo/0/" + state.numberOfEvents, config)
      .catch((err) => console.error(err));

    var general = [];
    var hack = [];
    var innovate = [];
    var ai = [];
    var cyber = [];
    var design = [];

    if (eventData === undefined) {
      return;
    }

    eventData.data.forEach((eventInfo) => {
      switch (eventInfo.organization) {
        case "ACM":
          general.push(eventInfo);
          break;
        case "AI":
          ai.push(eventInfo);
          break;
        case "Hack":
          hack.push(eventInfo);
          break;
        case "Design":
          design.push(eventInfo);
          break;
        case "Cyber":
          cyber.push(eventInfo);
          break;
        case "Innovate":
          innovate.push(eventInfo);
          break;
        default:
          general.push(eventInfo);
          break;
      }
    });

    //inserts into graph and updates state
    const tableData = {
      datasets: [
        {
          data: [
            general.length,
            hack.length,
            innovate.length,
            ai.length,
            cyber.length,
            design.length,
          ],
          backgroundColor: [
            "rgb(68, 68, 68)",
            "rgb(255, 168, 95)",
            "rgb(126, 109, 246)",
            "rgb(255, 112, 114)",
            "rgb(59, 192, 192)",
            "rgb(240, 130, 160)",
          ],
        },
      ],
      labels: ["General", "Hack", "Innovate", "AI", "Cyber", "Design"],
    };
    setState({ ...state, data: tableData });
  };

  const getDataTime = async () => {
    //gets token
    const config = {
      headers: {
        "x-auth-token": user.token,
      },
    };
    //gets all event data
    const eventData = await axios
      .get("/api/event/eventInfo/0/" + state.numberOfEvents, config)
      .catch((err) => console.error(err));

    var general = [];
    var hack = [];
    var innovate = [];
    var ai = [];
    var cyber = [];
    var design = [];

    if (eventData === undefined) {
      return;
    }

    eventData.data.forEach((eventInfo) => {
      switch (eventInfo.organization) {
        case "ACM":
          general.push(eventInfo);
          break;
        case "AI":
          ai.push(eventInfo);
          break;
        case "Hack":
          hack.push(eventInfo);
          break;
        case "Design":
          design.push(eventInfo);
          break;
        case "Cyber":
          cyber.push(eventInfo);
          break;
        case "Innovate":
          innovate.push(eventInfo);
          break;
        default:
          general.push(eventInfo);
          break;
      }
    });

    //inserts into graph and updates state
    const tableData = {
      datasets: [
        {
          data: [
            general.length,
            hack.length,
            innovate.length,
            ai.length,
            cyber.length,
            design.length,
          ],
          backgroundColor: [
            "rgb(68, 68, 68)",
            "rgb(255, 168, 95)",
            "rgb(126, 109, 246)",
            "rgb(255, 112, 114)",
            "rgb(59, 192, 192)",
            "rgb(240, 130, 160)",
          ],
        },
      ],
      labels: ["General", "Hack", "Innovate", "AI", "Cyber", "Design"],
    };
    setState({ ...state, data: tableData });
  };

  useEffect(() => {
    getDataNumber();
  }, [state.numberOfEvents, state.displayType]);

  useEffect(() => {}, [state.timePeriod, state.displayType]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {state.data == null ? (
        <Fragment>
          <LinearProgress />
          <Pie options={state.options} />
        </Fragment>
      ) : (
        <Pie data={state.data} options={state.options} />
      )}
      <Select
        id="chart-type"
        value={state.numberOfEvents}
        onChange={(e) => {
          setState({ ...state, numberOfEvents: e.target.value });
        }}
      >
        <MenuItem value={10}>10 Events</MenuItem>
        <MenuItem value={20}>20 Events</MenuItem>
        <MenuItem value={30}>30 Events</MenuItem>
        <MenuItem value={40}>40 Events</MenuItem>
        <MenuItem value={50}>50 Events</MenuItem>
        <MenuItem value={60}>60 Events</MenuItem>
        <MenuItem value={70}>70 Events</MenuItem>
        <MenuItem value={80}>80 Events</MenuItem>
        <MenuItem value={90}>90 Events</MenuItem>
        <MenuItem value={100}>100 Events</MenuItem>
      </Select>
    </div>
  );
};

export default PieChart;
