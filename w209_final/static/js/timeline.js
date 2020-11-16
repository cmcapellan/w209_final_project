var missions =  d3.csv("static/data/missions.csv", function(csv_data) {
    var missiondata = d3.nest()
                        .key(d => d.Program)
                        .key(d => d["Launch Vehicle"])
                        .entries(csv_data);  
    var missiondata = missiondata.map(
                        function(groupdata) {
                          return {
                            "group": groupdata.key,
                            "data": groupdata.values.map(
                              function(labeldata) {
                                return {
                                  "label": labeldata.key,
                                  "data": labeldata.values.map(
                                    function(valuedata) {
                                      return {
                                        "timeRange": [valuedata.Start, valuedata.End],
                                        "val": valuedata["Launch Vehicle"],
                                        "labelVal": valuedata.Mission,
                                        "data": valuedata

                                      }
                                    }
                                  )
                                }
                              }
                            )
                          }
                        }
                      );
    console.log(missiondata)
    var missionsChart = TimelinesChart()
                        .data(missiondata)
                        .maxHeight(600)
                        .maxLineHeight("10px")
                        .topMargin(80)
                        .leftMargin(250)
                        .rightMargin(250)
                        //.sortChrono(false)
                        .zQualitative(true)
                        (document.getElementById('timeline_chart'));
    const css = `
      body { 
          background: black; 
      }
      .timelines-chart .reset-zoom-btn {
        fill: white;
      }
      .timelines-chart .axises .y-axis text, .timelines-chart .axises .grp-axis text {
        fill: white;
      }
      .brusher .tick text {
        fill: white;
      }
      .timelines-chart .axises .x-axis {
        stroke: white;
      }
      .chart-tooltip {
        background: #105bd8;
        color: white;
      }
      .chart-zoom-selection, .brusher .brush .selection {
        stroke: #105bd8;
        stroke-opacity: 1;
        stroke-width: 2px;
        fill: #105bd8;
        fill-opacity: 1;
        shape-rendering: crispEdges;
      }
      .timelines-chart .series-group {
        fill: black !important;
      }
    `;
    var options = 'top'
    styleInject(css, options);
});