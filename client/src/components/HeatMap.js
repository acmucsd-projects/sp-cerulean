import React, { Component } from "react";
import Helmet from "react-helmet";

var __html = require('./Matrix.js');
var template = { __html: __html };


class HeatMap extends Component {
  render() {
    return (
      <>
      <Helmet>
        <script>{`
        	(function(Utils) {
            const chartjsUrl = 'https://cdn.jsdelivr.net/npm/chart.js@3.0.0-alpha.2/dist/chart.js';
            const dateFnsUrl = 'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@1.1.0-alpha/dist/chartjs-adapter-date-fns.bundle.js';
            const remoteUrl = 'https://cdn.jsdelivr.net/npm/chartjs-chart-matrix@1.0.0-beta/dist/chartjs-chart-matrix.js';
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
                .get("/api/event/eventInfoDateRange/2020-01-01T00%3A00%3A00.000Z/2020-07-01T00%3A00%3A00.000Z", config)
                .catch((err) => console.error(err));
              var ids = [];
              var starts = [];
              var ends = [];
              var atten = [];
        
              if (eventData === undefined) {
                return;
              }

              eventData.data.map((eventInfo) => {
                ids.push(eventInfo.uuid);
                starts.push(eventInfo.eventstart);
                ends.push(eventInfo.eventend);
                atten.push(eventInfo.attendances);
              });

        
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
                    data[day][j].totalAtt = atten[i];
                  } else {
                    data[day][j].num += 1;
                    data[day][j].totalAtt += atten[i];
                  }
                }
              }
              const graphData = [];
              for (i = 1; i < data.length; i++) {
                for (j = 0; j < data[1].length; j++) {
                  let dt = new Date(2020, 7, 7);
                  dt.setHours(j,0,0);
                  if (typeof(data[i][j].num)  !== 'undefined') {
                    var avgAttn = data[i][j].totalAtt / data[i][j].num;
                    maxValue = ((avgAttn > maxValue)? avgAttn : maxValue);
                    minValue = ((avgAttn < minValue)? avgAttn : minValue);
                    graphData.push({
                      x: i.toString(),
                      y: dt,
                      d: dt,
                      v: avgAttn,
                      n: data[i][j].num
                    })
                  } 
                  else if (j>= 14 && j <=24) {
                    graphData.push({
                      x: i.toString(),
                      y: dt,
                      d: dt,
                      v: 0,
                      n: 0
                    })
                  }
                }
              }
              makeGraph(graphData);
            };
            var maxValue = 0;
            var minValue = 100000;
            function makeGraph(graphData) {
              console.log(minValue);
              const ctx = document.getElementById('chart-area').getContext('2d');
              window.myMatrix = new Chart(ctx, {
                  type: 'matrix',
                  data: {
                    datasets: [{
                      label: 'My chart matrix',
                      data: graphData,
                      backgroundColor(c) {
                        const value = c.dataset.data[c.dataIndex].v;
                        const alpha = (value == 0)? (5 / maxValue) : (15 + value - minValue) / maxValue;
                        return Chart.helpers.color('#313F54').alpha(alpha).rgbString();
                      },
                      borderColor(c) {
                        const value = c.dataset.data[c.dataIndex].v;
                        const alpha = (value == 0)? (5 / maxValue): (15 + value - minValue) / maxValue;
                        return Chart.helpers.color('#313F54').alpha(alpha).darken(0.3).rgbString();
                      },
                      borderWidth: 1,
                      hoverBackgroundColor: '#C5B1FC',
                                  hoverBorderColor: '#855CF8',
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
                    // title: {
                    //   display: true,
                    //   fontSize: 40,
                    //   text: 'Average Attendance Based on Time and Day of the Week'
                    // },
                    tooltips: {
                      displayColors: false,
                      callbacks: {
                        title() {
                          return '';
                        },
                        label(context) {
                          const v = context.dataset.data[context.dataIndex];
                          return ['Average Attendance: ' + v.v.toFixed(2),'Sample Size: ' + v.n];
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
                        },
                        ticks: {
                          maxRotation: 0,
                          autoSkip: true,
                          padding: 10
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
            }

            window.onload = function(done) {
              addScript(chartjsUrl, () => {
                addScript(dateFnsUrl, () => {
                  addScript(remoteUrl, () => {
                    addScript(axiosUrl, () => {
                      getData();
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
export default HeatMap;