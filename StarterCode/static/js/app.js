// Use D3 to load the json data
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
  // Create variables for your data for easier access
  let samples = data.samples;
  let metadata = data.metadata;

  // Function to draw charts
  function drawCharts(sample) {
    let sampleData = samples.filter(s => s.id == sample)[0];

    // Create horizontal bar chart
    let barData = [{
      y: sampleData.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x: sampleData.sample_values.slice(0, 10).reverse(),
      text: sampleData.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    Plotly.newPlot("bar", barData);

    // Create bubble chart
    let bubbleData = [{
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: "markers",
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        colorscale: "Earth"
      }
    }];

    Plotly.newPlot("bubble", bubbleData);
  }

  // Function to display metadata
  function showMetadata(sample) {
    let sampleMetadata = metadata.filter(m => m.id == sample)[0];
    let metadataDisplay = d3.select("#sample-metadata");

    metadataDisplay.html("");
    Object.entries(sampleMetadata).forEach(([key, value]) => {
      metadataDisplay.append("h6").text(`${key}: ${value}`);
    });
  }

  // Function to populate the dropdown menu
  function initDropdown() {
    let dropdown = d3.select("#selDataset");

    samples.forEach((sample) => {
      dropdown.append("option")
      .text(sample.id)
      .property("value", sample.id);
    });
  }

  // Initialize the dashboard with the first sample in the dataset
  let firstSample = samples[0].id;
  drawCharts(firstSample);
  showMetadata(firstSample);
  initDropdown();  // Populate the dropdown

  // Dropdown menu change handler
  d3.selectAll("#selDataset").on("change", function() {
    // Get the value of the dropdown menu
    let newSample = d3.select("#selDataset").node().value;

    // Update the charts and metadata with the newly selected sample
    drawCharts(newSample);
    showMetadata(newSample);
  });
});
