import React, { useContext, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { MenuItem, Select } from "@material-ui/core";
import { UserContext } from "../UserContext";
import { sub } from "date-fns";

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
    timePeriod: "1 week",
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
    const endDate = new Date("July 1, 2020 00:00:00");
    var startDate;
    switch (state.timePeriod) {
      case "1 week":
        startDate = sub(endDate, { weeks: 1 });
        break;
      case "1 month":
        startDate = sub(endDate, { months: 1 });
        break;
      case "3 months":
        startDate = sub(endDate, { months: 3 });
        break;
      case "6 months":
        startDate = sub(endDate, { months: 6 });
        break;
      case "1 year":
        startDate = sub(endDate, { years: 1 });
        break;
      default:
        break;
    }

    const encodedEndDate = encodeURIComponent(endDate.toISOString());
    const encodedStartDate = encodeURIComponent(startDate.toISOString());

    const eventData = await axios
      .get(
        "/api/event/eventInfoDateRangeWithoutAttendance/" +
          encodedStartDate +
          "/" +
          encodedEndDate,
        config
      )
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
    if (state.displayType === "number") {
      getDataNumber();
    }
  }, [state.numberOfEvents, state.displayType]);

  useEffect(() => {
    if (state.displayType === "time") {
      getDataTime();
    }
  }, [state.timePeriod, state.displayType]);

  return (
    <div className="chart">
      <Pie data={state.data} options={state.options} />
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "2%" }}
      >
        <Select
          id="chart-type"
          value={state.displayType}
          style={{ marginRight: "5%" }}
          onChange={(e) => {
            setState({ ...state, displayType: e.target.value });
          }}
        >
          <MenuItem value={"number"}>Number Of Events</MenuItem>
          <MenuItem value={"time"}>Time Period</MenuItem>
        </Select>
        {state.displayType === "number" ? (
          <Select
            id="chart-type"
            value={state.numberOfEvents}
            onChange={(e) => {
              setState({
                ...state,
                numberOfEvents: e.target.value,
              });
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
        ) : (
          <Select
            id="chart-type"
            value={state.timePeriod}
            onChange={(e) => {
              setState({ ...state, timePeriod: e.target.value });
            }}
          >
            <MenuItem value={"1 week"}>1 week</MenuItem>
            <MenuItem value={"1 month"}>1 month</MenuItem>
            <MenuItem value={"3 months"}>3 months</MenuItem>
            <MenuItem value={"6 months"}>6 months</MenuItem>
            <MenuItem value={"1 year"}>1 year</MenuItem>
          </Select>
        )}
      </div>
    </div>
  );
};

export default PieChart;
