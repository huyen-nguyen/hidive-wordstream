// WordStream Configuration
let svg = d3.select("body").append('svg')
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);

let config = {
    topWord: 100,
    minFont: 12,
    maxFont: 32,
    tickFont: 12,
    legendFont: 12,
    curve: d3.curveMonotoneX
};

// Load data
d3.csv("../data/hidive/data.csv", function (row){
    return {                                    // renaming columns
        key: row["Key"],
        year: +row["Publication Year"],
        authors: row["Author"],
        title: row["Title"],
        venue: row["Publication Title"],
        DOI: row["DOI"],
        URL: row["Url"]
    };
}, function (error, data){
    if (error) throw error;

    console.log(data)

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
    console.log("groupedData", groupedData);

    // restructure to put into WS format
    const restructured = groupedData.map((group, timeIndex) => {
        let wordsByCategory = {};
        let recordsByCategory = {};
        const categories = [...Object.keys(taxonomy), other];

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

    console.log("restructured", restructured)

    wordstream(svg, restructured, config)

});

function processTitle(array2, category, timeIndex){
    const concatenatedTitles = array2.map(d => d.title).join(" ")
    const wordsArray = cleanAndTokenizeText(concatenatedTitles)
    return countWordFrequency(wordsArray, category, timeIndex)
}

function cleanAndTokenizeText(text){
    // remove punctuation
    const cleanedText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");

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
