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

            window.onload = function(done) {
              addScript(chartjsUrl, () => {
                addScript(dateFnsUrl, () => {
                  addScript(remoteUrl, () => {
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
                                        labelString: 'Hour label',
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