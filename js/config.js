// HIDIVE data
const taxonomy = {
    'Cell': ["Cell", "Cell Reports", "Cancer Cell", "Cell Systems", "Histochemistry and Cell Biology"],

    'Visualization': ["IEEE Transactions on Visualization and Computer Graphics", "Computer Graphics Forum","2023 IEEE Visualization and Visual Analytics (VIS)", "Poster Compendium of the IEEE Conference on Information Visualization (InfoVis’ 15)", "Information Visualization", "IEEE Symposium on Biological Data Visualization 2011", "Proceedings of the IEEE Information Visualization Conference–Posters (InfoVis’ 19)", "Poster Compendium of the IEEE VIS Conference. IEEE", "2023 IEEE VIS Workshop on Visualization Education, Literacy, and Activities (EduVis)", "IEEE Computer Graphics and Applications", "EuroVis 2016 - Posters", "Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems", "2019 IEEE Visualization Conference (VIS)"],

    "Bioinformatics": ["Bioinformatics", "BMC Bioinformatics", "PLoS Computational Biology", "Biocomputing 2021", "Bioinformatics (Oxford, England)", "Journal of Biomedical Informatics", "Biocomputing 2016: Proceedings of the Pacific Symposium", ],

    'Nature': ["Nature", "Nature Methods", "Nature Genetics", "Nature Communications", "Nature Medicine", "Nature Cell Biology", "Nature Biotechnology", "Nature Aging"],
}

// Misc
const stopWords = [
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "aren't", "as", "at", "be", "because", "been", "before",
    "being", "below", "between", "both", "but", "by", "can't", "cannot",
    "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing",
    "don't", "down", "during", "each", "few", "for", "from", "further", "had",
    "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd",
    "he'll", "he's", "her", "here", "here's", "hers", "herself", "him",
    "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if",
    "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me",
    "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off",
    "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves",
    "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's",
    "should", "shouldn't", "so", "some", "such", "than", "that", "that's",
    "the", "their", "theirs", "them", "themselves", "then", "there", "there's",
    "these", "they", "they'd", "they'll", "they're", "they've", "this", "those",
    "through", "to", "too", "under", "until", "up", "very", "was", "wasn't",
    "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what",
    "what's", "when", "when's", "where", "where's", "which", "while", "who",
    "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't",
    "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself",
    "yourselves", "ain", "aren", "couldn", "didn", "doesn", "hadn", "hasn",
    "haven", "isn", "ma", "mightn", "mustn", "needn", "shan", "shouldn",
    "wasn", "weren", "won", "wouldn", "dont"
];
const other = 'Others'