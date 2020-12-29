import React, { Component } from "react";
import Helmet from "react-helmet";

var __html = require('./Matrix.js');
var template = { __html: __html };


class TestChart extends Component {
  render() {
    return (
      <>
      <Helmet>
        <script>{`
        	(function(Utils) {
            const chartjsUrl = 'https://cdn.jsdelivr.net/npm/chart.js@3.0.0-alpha.2/dist/chart.js';
            const dateFnsUrl = 'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@1.1.0-alpha/dist/chartjs-adapter-date-fns.bundle.js';
            const remoteUrl = 'http://yourjavascript.com/042111232565/chartjs-chart-matrix.js';
            const axiosUrl = 'https://unpkg.com/axios/dist/axios.min.js';

            function addScript(url, done, error) {
              const head = document.getElementsByTagName('head')[0];
              const script = document.createElement('script');
              script.type = 'text/javascript';
              script.onreadystatechange = function() {
                if (this.readyState === 'complete') {
                  done();
                }
              };
              script.onload = done;
              script.onerror = error;
              script.src = url;
              head.appendChild(script);
              return true;
            }

          
            function loadError() {
              const msg = document.createTextNode('Error loading chartjs-chart-matrix');
              document.body.appendChild(msg);
              return true;
            }
            function isoDayInt(dt) {
              let wd = dt.getDay(); // 0..6, from sunday
              wd = (wd + 6) % 7 + 1; // 1..7 from monday
              return wd; // string so it gets parsed
            }
            function isoDayOfWeek(dt) {
              let wd = dt.getDay(); // 0..6, from sunday
              wd = (wd + 6) % 7 + 1; // 1..7 from monday
              return '' + wd; // string so it gets parsed
            }
            function generateData() {
                const data = [];
                for (let i=1; i <= 7; i++) {
                    for (let j=10; j <=22; j++) {
                        let dt = new Date(2020, 7, 7);
                        dt.setHours(j,0,0);
                        data.push({
                            x: isoDayOfWeek(new Date(2020, 6, i)),
                            y: dt,
                            d: dt,
                            v: Math.random() * 40
                        })
                    }
                }
                return data;
            }

            const getData = async () => {
              const config = {
                headers: {
                  "x-auth-token": localStorage.getItem("token"),
                },
              };
              //gets all event data
              const eventData = await axios
                .get("/api/event/eventInfo/0/" + 10, config)
                .catch((err) => console.error(err));
              var ids = [];
              var starts = [];
              var ends = [];
        
              if (eventData === undefined) {
                return;
              }

              console.log("received event data:");
              console.log(eventData);

              eventData.data.map((eventInfo) => {
                ids.push(eventInfo.uuid);
                starts.push(eventInfo.eventstart);
                ends.push(eventInfo.eventend);
              });
              console.log(starts);
              console.log(ends);
        
              //getting event attendance
              let attendanceArr = [];
              for (var i = 0; i < ids.length; i++) {
                const pointData = await axios
                  .get("/api/event/eventAttend/" + ids[i], config)
                  .catch((err) => console.error(err));
                  attendanceArr.push(pointData.data.numberOfAttendances);
              }
        
              // initialize the data array, could be done better.
              // Data [day of the week (1-7)][hour (0-23)]
              const data = [];
              for (i = 1; i <= 7; i++) {
                data[i]=[];
                for (var j = 0; j<24; j++) {
                  data[i][j] = [];
                }
              }

              for (i = 0; i < ids.length; i++) {
                var startHour = (new Date(Date.parse(starts[i]))).getHours();
                var endHour = (new Date(Date.parse(ends[i]))).getHours();
                for (j = startHour; j<= endHour; j++) {
                  var day = isoDayInt(new Date(Date.parse(starts[i])));
                  if(typeof(data[day][j].num) === 'undefined') {
                    data[day][j].num = 1;
                    data[day][j].totalAtt = attendanceArr[i];
                  } else {
                    data[day][j].num += 1;
                    data[day][j].totalAtt += attendanceArr[i];
                  }
                }
              }
              console.log(data);
              const graphData = [];
              for (i = 1; i < data.length; i++) {
                for (j = 0; j < data[1].length; j++) {
                  if (typeof(data[i][j].num)  !== 'undefined') {
                    graphData.push({
                      x: i,
                      y: j,
                      d: j,
                      v: data[i][j].totalAtt / data[i][j].num,
                      n: data[i][j].num
                    })
                  } 
                  else if (j>= 9 && j <=15) {
                    graphData.push({
                      x: i,
                      y: j,
                      d: j,
                      v: 0,
                      n: 0
                    })
                  }
                }
              }
        
              console.log(graphData);
        
          
              // inserts into graph and updates state
              // const tableData = {
              //   datasets: [{
              //     label: 'My chart matrix',
              //     data: generateData(),
              //     backgroundColor(c) {
              //       const value = c.dataset.data[c.dataIndex].v;
              //       const alpha = (10 + value) / 60;
              //       return window.Chart.helpers.color('green').alpha(alpha).rgbString();
              //     },
              //     borderColor(c) {
              //       const value = c.dataset.data[c.dataIndex].v;
              //       const alpha = (10 + value) / 60;
              //       return window.Chart.helpers.color('green').alpha(alpha).darken(0.3).rgbString();
              //     },
              //     borderWidth: 1,
              //     hoverBackgroundColor: 'yellow',
              //     hoverBorderColor: 'yellowgreen',
              //     width(c) {
              //       const a = c.chart.chartArea || {};
              //       const nt = c.chart.scales.x.ticks.length;
              //       return (a.right - a.left) / nt - 3;
              //     },
              //     height(c) {
              //       const a = c.chart.chartArea || {};
              //       const nt = c.chart.scales.y.ticks.length;
              //       return (a.bottom - a.top) / nt - 3;
              //     }
              //   }]
              // };
              // window.myMatrix.data.datasets[0].data = graphData;
              // window.myMatrix.update();
              console.log(window.myMatrix.data.datasets[0].data);
            };

            window.onload = function(done) {
              addScript(chartjsUrl, () => {
                addScript(dateFnsUrl, () => {
                  addScript(remoteUrl, () => {
                    addScript(axiosUrl, () => {
                      getData();
                      Chart.defaults.fontSize = 12;
                      const ctx = document.getElementById('chart-area').getContext('2d');
                      window.myMatrix = new Chart(ctx, {
                          type: 'matrix',
                          data: {
                            datasets: [{
                              label: 'My chart matrix',
                              data: generateData(),
                              backgroundColor(c) {
                                const value = c.dataset.data[c.dataIndex].v;
                                const alpha = (10 + value) / 60;
                                return Chart.helpers.color('green').alpha(alpha).rgbString();
                              },
                              borderColor(c) {
                                const value = c.dataset.data[c.dataIndex].v;
                                const alpha = (10 + value) / 60;
                                return Chart.helpers.color('green').alpha(alpha).darken(0.3).rgbString();
                              },
                              borderWidth: 1,
                              hoverBackgroundColor: 'yellow',
                                          hoverBorderColor: 'yellowgreen',
                                          width(c) {
                                const a = c.chart.chartArea || {};
                                const nt = c.chart.scales.x.ticks.length;
                                return (a.right - a.left) / nt - 3;
                              },
                              height(c) {
                                const a = c.chart.chartArea || {};
                                const nt = c.chart.scales.y.ticks.length;
                                return (a.bottom - a.top) / nt - 3;
                              }
                            }]
                          },
                          options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: {
                              display: false
                            },
                            tooltips: {
                              displayColors: false,
                              callbacks: {
                                title() {
                                  return '';
                                },
                                label(context) {
                                  const v = context.dataset.data[context.dataIndex];
                                  return ['v: ' + v.v.toFixed(2)];
                                }
                              }
                            },
                            scales: {
                              y: {
                                type: 'time',
                                left: 'left',
                                offset: true,
                                time: {
                                  unit: 'hour',
                                  round: 'hour',
                                  // displayFormats: {
                                  //     hour: 'hA'
                                  // }
                                },
                                ticks: {
                                  maxRotation: 0,
                                  autoSkip: true,
                                  padding: 1
                                },
                                gridLines: {
                                  display: false,
                                  drawBorder: false,
                                  tickMarkLength: 0,
                                },
                                scaleLabel: {
                                  display: true,
                                  fontSize: 15,
                                  padding: 0
                                }
                              },
                              x: {
                                type: 'time',
                                position: 'top',
                                offset: true,
                                time: {
                                  unit: 'day',
                                  parser: 'i',
                                  displayFormats: {
                                      day: 'iiii'
                                  }
                                },
                                ticks: {
                                    source: 'data',
                                    padding: 16
                                },
                                gridLines: {
                                  display: false,
                                  drawBorder: false,
                                  tickMarkLength: 0
                                }
                              }
                            }
                          }        
                      });
                    }, loadError);
                  }, loadError);
                }, loadError);
              }, loadError);
            };
          }(window.Utils = window.Utils || {}));
        `}
          
        </script>
      </Helmet>
      <div className="test-matrix">
        <span dangerouslySetInnerHTML={template} />
      </div>
      </>
    );
  }
}
export default TestChart;