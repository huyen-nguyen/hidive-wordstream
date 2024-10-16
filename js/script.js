let data_, restructured;
// WordStream Configuration
const svg = d3.select("#vis-container").append('svg')
    .attr("width", window.innerWidth)
    .attr("height", 800)
    .attr("id", "mainSVG");

function updateWindowSize(){
    svg.attr("width", window.innerWidth)
    document.getElementById("widthValue").value = window.innerWidth;
    visualize();
}

const config = {
    topWord: 100,
    minFont: 11,
    maxFont: 30,
    tickFont: 13,
    legendFont: 14,
    curve: d3.curveMonotoneX,
};

// Load data
d3.csv("data/hidive/data.csv", function (row){
    return {                                    // renaming columns
        key: row["Key"],
        year: row["Publication Year"],
        authors: row["Author"],
        title: row["Title"],
        venue: row["Publication Title"],
        DOI: row["DOI"],
        URL: row["Url"]
    };
}, function (error, data){
    if (error) throw error;

    data_ = data;

    const groupedData = d3.nest()
        .key(d => +d.year)      // group by year
        .key(d => {               // group by venue type
            if (taxonomy["Nature"].includes(d.venue)) return "Nature";
            else if (taxonomy["Visualization"].includes(d.venue)) return "Visualization";
            else if (taxonomy["Cell"].includes(d.venue)) return "Cell";
            else if (taxonomy["Bioinformatics"].includes(d.venue)) return "Bioinformatics";
            else return other
        })
        .entries(data).sort((a, b) => +a.key - +b.key)

    // restructure to put into WS format
    restructured = groupedData.map((group, timeIndex) => {
        let wordsByCategory = {};
        let recordsByCategory = {};

        // Iterate over each category
        categories.forEach(category => {
            const matchingCategory = group.values.filter(value => value.key === category);
            wordsByCategory[category] = matchingCategory.length ? processTitle(matchingCategory[0].values, category, timeIndex) : [];
            recordsByCategory[category] = matchingCategory.length ? matchingCategory[0].values.length : 0;
        });

        // Return the restructured object with date and categorized words
        return {
            date: group.key,         // The key of the group (date)
            words: wordsByCategory,   // The object with words categorized by taxonomy
            records: recordsByCategory
        };
    });

    wordstream(svg, restructured, config)
    drawTable(data);

});

function drawTable(dataset) {
    let tablediv = d3.select('#table-container'); // Select the div where the table will be placed
    tablediv.selectAll('*').remove(); // Clear any existing content

    let table = tablediv
        .append('table')
        .attr("class", "display")
        .attr("id", "dataTable");

    // Initialize DataTables with the dataset and column titles
    $(table.node()).DataTable({
        data: convertTabularData(dataset.sort((a, b) => +b.key - +a.key)), // Data to be displayed
        order: [[0, 'dsc']],
        "pageLength": 25, // Number of rows per page
        "deferRender": true, // Efficient rendering for large datasets
        autoWidth: false,
        columns: [
            { title: 'Year', className: 'col-year' },  // Class for 'Year' column
            { title: 'Authors', className: 'col-authors' }, // Class for 'Authors' column
            { title: 'Title', className: 'col-title title-col' }, // Class for 'Title' column
            { title: 'Venue', className: 'col-venue' },  // Class for 'Venue' column
            { title: 'DOI', className: 'col-doi' },  // Class for 'DOI' column
            { title: 'URL', className: 'col-url',  // Clas
                render: function(data) {
                    // Return the URL as a clickable link
                    return '<a href="' + data + '" target="_blank">' + data + '</a>';
                } },
        ],
        "drawCallback": function (settings) {
            // This is triggered after the table has been rendered
            $('td').each(function () {
                let content = $(this).text().trim(); // Get the content
                let authorsArray = content.split(";"); // Split the authors by semi-colon
                let visibleLimit = 20; // Limit of authors to show initially

                if (authorsArray.length > visibleLimit) {
                    let visibleAuthors = authorsArray.slice(0, visibleLimit).join(", ");
                    let hiddenAuthors = authorsArray.slice(visibleLimit).join(", ");

                    // Create the "Read More" and "Read Less" functionality
                    $(this).html(`
                    ${visibleAuthors}
                    <span class="more-authors" style="display:none;">, ${hiddenAuthors}</span>
                    <a href="#" class="read-more">Read More</a>
                `);

                    // Toggle the visibility of hidden authors when "Read More" is clicked
                    $(this).find('.read-more').on('click', function (e) {
                        e.preventDefault();
                        let moreAuthors = $(this).siblings('.more-authors');
                        if (moreAuthors.is(':visible')) {
                            moreAuthors.hide();
                            $(this).text('Read More');
                        } else {
                            moreAuthors.show();
                            $(this).text('Read Less');
                        }
                    });
                }
            });

            hightlighText();
        }
    });

    d3.select("#DataTables_Table_0").style("table-layout", "fixed")

    d3.select(".dt-search input").on("input", function() {
        var searchTerm = d3.select(this).property("value");
        // console.log("Typing in DataTables search box:", searchTerm);
        // resetFilter()
    });
}

function processTitle(array2, category, timeIndex){
    const concatenatedTitles = array2.map(d => d.title).join(" ")
    const wordsArray = cleanTitle(concatenatedTitles)
    return countWordFrequency(wordsArray, category, timeIndex)
}

function cleanTitle(text){
    // remove punctuation
    const cleanedText = text.replace(/[.,\/#!$%\^&\*;:{}=_`~()?"']/g, "");

    // convert to lowercase
    const lowerCaseText = cleanedText.toLowerCase();

    // tokenize the text into words (split by whitespace)
    const wordsArray = lowerCaseText.split(/\s+/)
        .filter(word => word.length > 0)                            //  remove empty strings
        .filter(word => !stopWords.includes(word.toLowerCase()));   // remove stopwords

    return wordsArray;
}

function countWordFrequency(wordsArray, category, timeIndex){
    let checkExistence = {};
    let boxCount = [];
    wordsArray.forEach(w => {
        if (!checkExistence[w]) { // have not existed
            checkExistence[w] = true
            let word = {
                "text": w,
                "frequency": 1,
                "topic": category,
                "id": w + "_" + category + "_" + timeIndex
            }
            boxCount.push(word);
        }

        else { // increment
            boxCount.find(word => word.text === w)["frequency"] += 1;
        }
    })
    return boxCount.sort((a,b) => b.frequency - a.frequency);
}

function convertTabularData(data){
    return data.map(d => {
        let result = [];
        selectedField.forEach(p => {
            result.push(d[p])
        })
        return result
    })
}

function title() {
    return selectedField.map(d => {
        return {
            title: capFirstLetter(d)
        }
    })
}

function capFirstLetter(word){
    return word.charAt(0).toUpperCase() + word.slice(1)
}

function updateTableUponSelection(){
    const filteredData = Object.values(filters).every(d => !d) ? data_ : data_.filter(record => {
            let matched = false;

        // Iterate through the filter object and apply the appropriate conditions
        for (let category of categories) {
            if (filters[category] && taxonomy[category]) { // Check if the filter value is not empty and not OTHERS
                if (taxonomy[category].includes(record.venue) && cleanTitle(record.title).includes(filters[category])) {
                    matched = true; // If venue matches and title contains the filter term, mark as matched
                    break; // No need to check further once a match is found
                }
            }
        }

        // If none of the categories A, B, C, D matched, check the 'Others' filter
        if (!matched && filters.Others) {
            // Check if venue is not one of the specified categories and title contains 'Others' filter
            if (cleanTitle(record.title).includes(filters.Others)) {
                matched = true;
            }
        }
        return matched; // Return the record if it matched any of the conditions
    });

    drawTable(filteredData)
}

function hightlighText(){
    // if filter is empty, return
    if (Object.values(filters).every(d => !d)) return

    let textArr = Object.values(filters).filter(d => d.length > 0)

    var instance = new Mark(document.querySelectorAll("td.title-col"));
    instance.mark(textArr, {
        "wildcards": "withSpaces",
        "ignoreJoiners": true,
        "acrossElements": false,
        "accuracy": {
            "value": "exactly",
            "limiters": [" ", ".", "\"", "'", "]", "[", "}", "{", ")", "(", "–", "-", ":", ";", "?", "!", ",", "/"]
        },
    });

    d3.selectAll("mark")
        .style("background", function () {
            let item = this.innerHTML.split("<")[0].toLowerCase()
            return hexaChangeRGB(colorWord(getCategory(item)), 0.3)
        })
        .classed("highlight", true)
        .html(function () {
            let item = this.innerHTML.split("<")[0].toLowerCase()
            return this.innerHTML.split("<")[0] + '<span style="color: ' + colorWord(getCategory(item)) + '">' + getCategory(item) + '</span>'
        })
}

function hexaChangeRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

function getCategory(text){
    return categories.find(d => filters[d] === text)
}

function legendDescription(text){
    if (text === other) {
        return "Others, including Genome Biology, PLOS ONE, PLOS Digital Health, Cancer Discovery, Immunity, eClinicalMedicine, npj Digital Medicine"
    }
    return text + ': ' + taxonomy_shorten[text].join(", ")
}

function resetFilter(){
    Object.keys(filters).forEach(key => filters[key] = "")
}