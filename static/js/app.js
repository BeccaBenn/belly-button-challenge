// Dropdown menu change
function optionChanged(selectedSample) {
    // Load data from samples.json
    d3.json("samples.json").then(function(data) {
        // Find the index of the selectedSample in the names array
        var selectedIndex = data.names.indexOf(selectedSample);

        // Check if the selectedSample exists in the names array
        if (selectedIndex !== -1) {
            // Get the corresponding metadata
            var selectedData = data.metadata[selectedIndex];

            // Update demographic info
            updateDemographicInfo(selectedData);

            // Call barChart update function
            updateBarChart(data.samples[selectedIndex]);

            // Call bubblechart update function
            updateBubbleChart(data.samples[selectedIndex]);

        } else {
            console.error("Selected sample not found in the data.");
        }
    });
}

// Update demographic info
function updateDemographicInfo(metadata) {
    var demographicInfo = d3.select("#sample-metadata");
    demographicInfo.html("");

    // Check if metadata is defined
    if (metadata && Object.keys(metadata).length > 0) {
            Object.entries(metadata).forEach(([key, value]) => {
            demographicInfo.append("p").text(`${key}: ${value}`);
        });
    } else {
        // If metadata is undefined or empty
        demographicInfo.append("p").text("No demographic information available.");
    }
}

// Update bar chart
function updateBarChart(selectedData) {
    var top10Values = selectedData.sample_values.slice(0, 10).reverse();
    var top10Labels = selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    var hoverText = selectedData.otu_labels.slice(0, 10).reverse();

    var trace = {
        type: "bar",
        orientation: "h",
        x: top10Values,
        y: top10Labels,
        text: hoverText
    };

    var layout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU ID" }
    };

    Plotly.newPlot("bar", [trace], layout);
}

// Update bubble chart
function updateBubbleChart(selectedData) {
    var trace = {
        x: selectedData.otu_ids,
        y: selectedData.sample_values,
        mode: 'markers',
        marker: {
            size: selectedData.sample_values,
            color: selectedData.otu_ids,
            colorscale: 'Earth'
        },
        text: selectedData.otu_labels
    };

    var layout = {
        title: 'Bubble Chart',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' }
    };

    Plotly.newPlot("bubble", [trace], layout);
}


// Initial data loading and chart 
d3.json("samples.json").then(function(data) {
    var dropdownMenu = d3.select("#selDataset");
    data.names.forEach(function(sample) {
        dropdownMenu.append("option").text(sample).property("value", sample);
    });

    // Initial chart 
    optionChanged(data.names[0]);
});

// Fetch data and plot charts
function data_plot(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        // Bubble Chart
        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30 }
        };
        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ];

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
        // Bar Chart
        var barData =
        {
            y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
        };

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", [barData], barLayout);
    });
}

function init() {
    // Get the select ID 
    var selector = d3.select("#selDataset");

        d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        var sampleNames = data.names;

        for (var i = 0; i < sampleNames.length; i++) {
            selector
                .append("option")
                .text(sampleNames[i])
                .property("value", sampleNames[i]);
        };

        // Use sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        data_plot(firstSample);
        buildMetadata(firstSample);
    });
};

function buildMetadata(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {

        //demographic info
        var meta = d3.select("#sample-metadata");
        meta.html('')
        var samplemeta = data.metadata.find(sampleObj => sampleObj.id == sample);
        Object.entries(samplemeta).forEach(([key, value]) => {
            meta.append("h6").text(`${key}:${value}`);
        });
    });
}

function optionChanged(newSample) {
    // get new data each time a new sample is selected
    data_plot(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();
