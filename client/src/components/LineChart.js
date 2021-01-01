import React, { useContext, useEffect, useState } from "react";
import { Button, MenuItem, Select } from "@material-ui/core";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { UserContext } from "../UserContext";
import { sub } from "date-fns";
import { cy } from "date-fns/locale";

const LineChart = () => {
    const { user } = useContext(UserContext);
    const [state, setState] = useState({
        data: { datasets: [] },
        options: {
            title: {
                display: true,
                text: "Event Attendance",
                fontSize: 40,
            },
            scales : {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Event Attendance",
                        padding: 10,
                        fontSize: 15,
                        beginAtZero: true,
                        ticks: {
                            suggestedMin: 0
                        }
                    }
                }],
            },
            legend: {
                display: false,
            },
        },
        timePeriod: "Last 30 Days",
    });
    let eventAttendance;
    let labels = [];
    let labelString;
    const getData = async () => {
        //gets token
        const config = {
            headers: {
                "x-auth-token": user.token
            }
        };
        //gets all event data
        const endDate = new Date("July 1, 2020 00:00:00");
        let startDate = sub(endDate, { months: 1});
        switch(state.timePeriod) {
            case "Last 7 Days":
                startDate = sub(endDate, { weeks: 1 });
                for (let i = 7; i > 0; i--) {
                    labels.push(i.toString());
                }
                labelString = "Days From Today";
                break;
            case "Last 30 Days":
                startDate = sub(endDate, { months: 1 });
                for (let i = 30; i > 0; i--) {
                    labels.push(i.toString());
                }
                labelString = "Days From Today";
                break;
            case "Last 12 Weeks":
                startDate = sub(endDate, { months: 3 });
                for (let i = 12; i > 0; i--) {
                    labels.push(i.toString());
                }
                labelString = "Weeks From Today";
                break;
            case "Last 24 Weeks":
                startDate = sub(endDate, { months: 6 });
                for (let i = 24; i > 0; i--) {
                    labels.push(i.toString());
                }
                labelString = "Weeks From Today";
                break;
            case "Last 12 Months":
                startDate = sub(endDate, { years: 1 });
                for (let i = 12; i > 0; i--) {
                    labels.push(i.toString());
                }
                labelString = "Months From Today";
                break;
            default:
                console.log('inside default');
                break;
        }

        const encodedEndDate = encodeURIComponent(endDate.toISOString());
        const encodedStartDate = encodeURIComponent(startDate.toISOString());

        const eventData = await axios
            .get(
                "/api/event/eventInfoDateRange/" +
                encodedStartDate +
                "/" +
                encodedEndDate,
                config)
            .catch((err) => console.error(err));

        let generalEvents = [];
        let hackEvents = [];
        let innovateEvents = [];
        let aiEvents = [];
        let cyberEvents = [];
        let designEvents = [];

        if (eventData === undefined) {
        return;
        }

        let generalAttendance = [];
        let aiAttendance = [];
        let hackAttendance = [];
        let designAttendance = [];
        let cyberAttendance = [];
        let innovateAttendance = [];
        let allAttendance = [];

        let numValues;
        let iterateType;
        switch (state.timePeriod) {
            case "Last 7 Days":
                numValues = 7;
                iterateType = "day";
                break;
            case "Last 30 Days":
                numValues = 30;
                iterateType = "day";
                break;
            case "Last 12 Weeks":
                numValues = 12;
                iterateType = "week";
                break;
            case "Last 24 Weeks":
                numValues = 24;
                iterateType = "week";
                break;
            case "Last 12 Months":
                numValues = 12;
                iterateType = "month";
                break;
            default:
                break;
        }
        for (let i = 0; i < numValues; i++) {
            generalAttendance.push(0);
            aiAttendance.push(0);
            hackAttendance.push(0);
            designAttendance.push(0);
            cyberAttendance.push(0);
            innovateAttendance.push(0);
            allAttendance.push(0);
        }

        eventAttendance = [generalAttendance, aiAttendance, hackAttendance,
                                 designAttendance, cyberAttendance, innovateAttendance];
        
        eventData.data.forEach((eventInfo) => {
            let eventDate = new Date(eventInfo.eventstart);
            let timeDiff = endDate.getTime() - eventDate.getTime();
            let daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            let weeksDiff = Math.floor(timeDiff / (1000 * 3600 * 24 * 7));
            let monthsDiff = Math.floor(timeDiff / (1000 * 3600 * 24 * 7 * 4.345));

            let index;
            switch (iterateType) {
                case "day":
                    switch (state.timePeriod) {
                        case "Last 7 Days":
                            if (daysDiff % 7 === 0) {
                                index = 0;
                            }
                            else {
                                index = 7 - (daysDiff % 7);
                            }
                            break;
                        case "Last 30 Days":
                            if (daysDiff % 30 === 0) {
                                index = 0;
                            }
                            else {
                                index = 30 - (daysDiff % 30);
                            }
                    }
                    break;
                case "week":
                    switch (state.timePeriod) {
                        case "Last 12 Weeks":
                            if (weeksDiff % 12 === 0) {
                                index = 0;
                            }
                            else {
                                index = 12 - (weeksDiff % 12);
                            }
                            break;
                        case "Last 24 Weeks":
                            if (weeksDiff % 24 === 0) {
                                index = 0;
                            }
                            else {
                                index = 24 - (weeksDiff % 24);
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                case "month":
                    if (monthsDiff % 12 === 0) {
                        index = 0;
                    }
                    else {
                        index = 12 - (monthsDiff % 12);
                    }
                    break;
                default:
                    break;
            }

            switch (eventInfo.organization) {
                case "ACM":
                    generalAttendance[index] += eventInfo.attendances;
                    break;
                case "AI":
                    aiAttendance[index] += eventInfo.attendances;
                    break;
                case "Hack":
                    hackAttendance[index] += eventInfo.attendances;
                    break;
                case "Design":
                    designAttendance[index] += eventInfo.attendances;
                    break;
                case "Cyber":
                    cyberAttendance[index] += eventInfo.attendances;
                    break;
                case "Innovate":
                    innovateAttendance[index] += eventInfo.attendances;
                    break;
                default:
                    generalAttendance[index] += eventInfo.attendances;
                    break;
            }
        });
        for (let i = 0; i < allAttendance.length; i++) {
            let attendanceCount = 0;
            for (let j = 0; j < eventAttendance.length; j++) {
                attendanceCount += eventAttendance[j][i];
            }
            allAttendance[i] = attendanceCount;
        }
        eventAttendance.push(allAttendance);
        console.log('inside getData');
    }

    const displayALL = async () => {
        await getData();
        //removes dataset from chart if it is already being displayed
        const numDataSets = state.data.datasets.length;
        const datasets = state.data.datasets.filter(dataset => dataset.label !== "all");
        if (numDataSets > datasets.length) {
            const tableData = {
                datasets: datasets,
                labels: labels
        
            }
            setState({ ...state, data: tableData });
            return;
        }
        //inserts into graph and updates state
        const tableData = {
            datasets: [...state.data.datasets,
                {   
                    label: "all",
                    fill: false,
                    borderColor: "#A6CEE3",
                    pointBackgroundColor: "#A6CEE3",
                    pointRadius: 6,
                    lineTension: 0,
                    data: eventAttendance[6],
                }
            ],
            labels: labels
        };
        setState({ ...state, data: tableData });
        console.log('inside displayAll');
        console.log(eventAttendance);

    }

    const displayAI = async () => {
        await getData();
        //removes dataset from chart if it is already being displayed
        const numDataSets = state.data.datasets.length;
        const datasets = state.data.datasets.filter(dataset => dataset.label !== "ai");
        if (numDataSets > datasets.length) {
            const tableData = {
                datasets: datasets,
                labels: labels
            }
            setState({ ...state, data: tableData });
            return;
        }
        //inserts into graph and updates state
        const tableData = {
            datasets: [...state.data.datasets,
                {   
                    label: "ai",
                    fill: false,
                    borderColor: "rgb(255, 112, 114)",
                    pointBackgroundColor: "rgb(255, 112, 114)",
                    pointRadius: 6,
                    lineTension: 0,
                    data: eventAttendance[1],
                }
            ],
            labels: labels
        };
        setState({ ...state, data: tableData });
    }

    const displayCYBER = async () => {
        await getData();
        //removes dataset from chart if it is already being displayed
        const numDataSets = state.data.datasets.length;
        const datasets = state.data.datasets.filter(dataset => dataset.label !== "cyber");
        if (numDataSets > datasets.length) {
            const tableData = {
                datasets: datasets,
                labels: labels
            }
            setState({ ...state, data: tableData });
            return;
        }
        //inserts into graph and updates state
        const tableData = {
            datasets: [...state.data.datasets,
                {   
                    label: "cyber",
                    fill: false,
                    borderColor: "rgb(59, 192, 192)",
                    pointBackgroundColor: "rgb(59, 192, 192)",
                    pointRadius: 6,
                    lineTension: 0,
                    data: eventAttendance[4],
                }
            ],
            labels: labels
        };
        setState({ ...state, data: tableData });
    }

    const displayDESIGN = async () => {
        await getData();
        //removes dataset from chart if it is already being displayed
        const numDataSets = state.data.datasets.length;
        const datasets = state.data.datasets.filter(dataset => dataset.label !== "design");
        if (numDataSets > datasets.length) {
            const tableData = {
                datasets: datasets,
                labels: labels
            }
            setState({ data: tableData });
            return;
        }
        //inserts into graph and updates state
        const tableData = {
            datasets: [...state.data.datasets,
                {   
                    label: "design",
                    fill: false,
                    borderColor: "rgb(240, 130, 160)",
                    pointBackgroundColor: "rgb(240, 130, 160)",
                    pointRadius: 6,
                    lineTension: 0,
                    data: eventAttendance[3],
                }
            ],
            labels: labels
        };
        setState({ ...state, data: tableData });
    }

    const displayHACK = async () => {
        await getData();
        //removes dataset from chart if it is already being displayed
        const numDataSets = state.data.datasets.length;
        const datasets = state.data.datasets.filter(dataset => dataset.label !== "hack");
        if (numDataSets > datasets.length) {
            const tableData = {
                datasets: datasets,
                labels: labels
            }
            setState({ ...state, data: tableData });
            return;
        }
        //inserts into graph and updates state
        const tableData = {
            datasets: [...state.data.datasets,
                {   
                    label: "hack",
                    fill: false,
                    borderColor: "rgb(255, 168, 95)",
                    pointBackgroundColor: "rgb(255, 168, 95)",
                    pointRadius: 6,
                    lineTension: 0,
                    data: eventAttendance[2],
                }
            ],
            labels: labels
        };
        setState({ ...state, data: tableData });
    }

    const displayINNOVATE = async () => {
        await getData();
        //removes dataset from chart if it is already being displayed
        const numDataSets = state.data.datasets.length;
        const datasets = state.data.datasets.filter(dataset => dataset.label !== "innovate");
        if (numDataSets > datasets.length) {
            const tableData = {
                datasets: datasets,
                labels: labels
            }
            setState({ ...state, data: tableData });
            return;
        }
        //inserts into graph and updates state
        const tableData = {
            datasets: [...state.data.datasets,
                {   
                    label: "innovate",
                    fill: false,
                    borderColor: "rgb(126, 109, 246)",
                    pointBackgroundColor: "rgb(126, 109, 246)",
                    pointRadius: 6,
                    lineTension: 0,
                    data: eventAttendance[5],
                }
            ],
            labels: labels
        };
        setState({ ...state, data: tableData });
    }
    
    return (
        <div className="chart">
            <Line data={state.data} options={state.options} />
            <div
                style={{ display: "flex", justifyContent: "center", marginTop: "1%"}}
            >
                <p style={{marginTop: "7px"}}>Show graph for:</p>
                <button type="button" onClick={displayALL} 
                    style={{backgroundColor: "#A6CEE3", borderColor: "white", borderRadius: "5px", margin: "5px"}}>
                    ALL</button>
                <button type="button" onClick={displayAI} 
                    style={{backgroundColor: "rgb(255, 112, 114)", borderColor: "white", borderRadius: "5px", margin: "5px"}}>
                    AI</button>
                <button type="button" onClick={displayCYBER} 
                    style={{backgroundColor: "rgb(59, 192, 192)", borderColor: "white", borderRadius: "5px", margin: "5px"}}>
                    Cyber</button>
                <button type="button" onClick={displayDESIGN} 
                    style={{backgroundColor: "rgb(240, 130, 160)", borderColor: "white", borderRadius: "5px", margin: "5px"}}>
                    Design</button>
                <button type="button" onClick={displayHACK} 
                    style={{backgroundColor: "rgb(255, 168, 95)", borderColor: "white", borderRadius: "5px", margin: "5px"}}>
                    Hack</button>
                <button type="button" onClick={displayINNOVATE} 
                    style={{backgroundColor: "rgb(126, 109, 246)", borderColor: "white", borderRadius: "5px", margin: "5px"}}>
                    Innovate</button>
            </div>
            <div
        style={{ display: "flex", justifyContent: "center", marginTop: "2%" }}
      >
        <Select 
          id="chart-type"
          value={state.timePeriod}
          onChange={(e) => {
            setState({ ...state, data: { datasets: [] }, timePeriod: e.target.value });
          }}
        >
          <MenuItem value={"Last 7 Days"}>Last 7 Days</MenuItem>
          <MenuItem value={"Last 30 Days"}>Last 30 Days</MenuItem>
          <MenuItem value={"Last 12 Weeks"}>Last 12 Weeks</MenuItem>
          <MenuItem value={"Last 24 Weeks"}>Last 24 Weeks</MenuItem>
          <MenuItem value={"Last 12 Months"}>Last 12 Months</MenuItem>
        </Select>
      </div>
        </div>
    );
};

export default LineChart;