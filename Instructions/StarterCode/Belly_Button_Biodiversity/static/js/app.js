function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var sampleURL = `/metadata/${sample}`
  d3.json(sampleURL).then(function (data) {
    // console.log(data)

    sampleTable = d3.select("#sample-metadata")

    Object.entries(data).forEach(([key, value]) => {
      var row = sampleTable.append("tr")
      var cell = row.append("td");
      cell.text(`${key}: ${value}`);
    });
  });

  // Use `.html("") to clear any existing metadata


};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  var dataURL = `/samples/${sample}`
  d3.json(dataURL).then(function (data) {
    console.log(data)
    var otuIds = data.otu_ids;
    var otuLabels = data.otu_labels;
    var sampleValues = data.sample_values;

    var trace1 = {
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      marker: {
        color: otuIds,
        size: sampleValues,
        text: otuLabels
      }
    };

    var bubbleData = [trace1];

    var layout = {
      title: 'Marker Size',
      showlegend: false,
      // height: 600,
      // width: 600
    };

    Plotly.newPlot("bubble", bubbleData, layout);
    
    var pieData = [{
      values: sampleValues.slice(0,10),
      labels: otuIds,
      // hoverinfo: otuLabels,
      type: 'pie'
    }];

    // var layout = {
    //   height: 400,
    //   width: 500
    // };

    Plotly.newPlot('pie', pieData);


  });

  // @TODO: Build a Bubble Chart using the sample data


  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
