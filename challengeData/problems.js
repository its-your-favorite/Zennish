var EXPORT = EXPORT || {};
EXPORT.challengeSet = [
    {
        name: "Matching",
        id: '0-matching',
        description: "Challenges around patterns in cards",
        difficulty: "Medium",
        recommended: 1,
        bestScore: {val: 0},
        difficultyColor: avgColor("BB0", "B00",0),
        defaultComparer: tripleEquals, /* function used to judge if answer is correct */
        scoring: [{level: 0}, {level: 1, time: 60*17, keystrokes: 1500}, {level: 2, time: 60*8, keystrokes: 700}],
        steps: [
            {
                id: 0,
                description: "You'll need to write a function that receives 5 cards. Each represented as a number (2-10) or face (J, Q, K, A) followed by a letter representing its suit (C,D,H,S). So the three of spades would be 3S and the ten of diamonds would be 10D and the Ace of hearts would be AH. Return true if that hand contains *at least* two of the same-value (i.e. number) card.",
                addFunction: ['isPair', 'card1','card2','card3','card4','card5'],
                defaultSolution: cards.atLeastPair,
                defaultTestee: 'isPair',
                demoTests: [["AH", "9H", "10H", "8H", "AC"]],
                tests: [["AH", "9H", "10H", "8H", "AC"], ["AH", "9H", "10H", "8H", "KC"], ["8S", "9H", "8C", "8H", "AC"],  ["3H", "3S", "3D", "8H", "3C"] ] /* answer followed by sets of parameters */
            },
            {
                id: 1,
                description: "Now write a function that returns true if that are at least two separate sets of cards that have at least two matching values (e.g. two pair or a full house)",
                addFunction: ['isTwoPair', 'card1','card2','card3','card4','card5'],
                defaultSolution: cards.atLeastTwoPair,
                defaultTestee: 'isTwoPair',
                demoTests: [["AH", "9H", "8C", "8H", "AC"]],
                tests: [["AH", "9H", "10H", "8H", "AC"], ["AH", "9H", "10H", "8H", "KC"], ["AH", "9H", "8C", "8H", "AC"],  ["3H", "9H", "10H", "8H", "AH"], ['6S', '6C', '6H', '4D', '4H'] ] /* answer followed by sets of parameters */
            },
            {
                id: 2,
                description: "Now write a function that returns true if a hand is a flush",
                addFunction: ['isFlush', 'card1','card2','card3','card4','card5'],
                defaultSolution: cards.isFlush,
                demoTests: [["AH", "9H", "8H", "7H", "KH"]],
                tests: [["AH", "9H", "10H", "8H", "AC"], ["AH", "9H", "10H", "8H", "KH"], ["AH", "9H", "8C", "8H", "AC"],
                    ["3C", "9C", "10C", "8C", "AC"], ["5H", "5C", "5S", "5D", "5H"] ], /* answer followed by sets of parameters */
            },
            {
                id: 3,
                description: "Now make all the functions you wrote work with objects that have a suit and value property.",
                addFunction: ['isFlush', 'card1','card2','card3','card4','card5'],
                demoTests: [{testee: "isFlush", solver: cards.isFlush, params: [{value:"A", suit:"H"}, {value:"9", suit:"H"}, {value:"8", suit:"H"}, {value:"7", suit:"H"}, {value:"K", suit:"H"}]}],
                tests: [
                    {testee: "isPair", solver: cards.atLeastPair, params: [{value:"A", suit:"H"}, {value:"9", suit:"C"}, {value:"8", suit:"S"}, {value:"A", suit:"S"}, {value:"K", suit:"H"}]},
                    {testee: "isPair", solver: cards.atLeastPair, params: [{value:"A", suit:"H"}, {value:"9", suit:"C"}, {value:"8", suit:"S"}, {value:"3", suit:"S"}, {value:"K", suit:"H"}]},
                    {testee: "isTwoPair", solver: cards.atLeastTwoPair, params: [{value:"A", suit:"H"}, {value:"A", suit:"S"}, {value:"8", suit:"H"}, {value:"8", suit:"D"}, {value:"2", suit:"H"}]},
                    {testee: "isTwoPair", solver: cards.atLeastTwoPair, params: [{value:"A", suit:"H"}, {value:"9", suit:"H"}, {value:"8", suit:"H"}, {value:"7", suit:"H"}, {value:"K", suit:"H"}]},
                    {testee: "isFlush", solver: cards.isFlush, params: [{value:"A", suit:"H"}, {value:"9", suit:"H"}, {value:"8", suit:"H"}, {value:"7", suit:"H"}, {value:"K", suit:"H"}]},
                    {testee: "isFlush", solver: cards.isFlush, params: [{value:"A", suit:"H"}, {value:"9", suit:"H"}, {value:"8", suit:"H"}, {value:"7", suit:"H"}, {value:"K", suit:"S"}]},
                ], /* answer followed by sets of parameters */
            },
        ],
    },
    {
    name: "It's a date!",
    id: '1-dates',
    description: "Challenges around representations of dates and times",
    difficulty: "Hard",
    difficultyColor: avgColor("BB0", "B00", .5),
    recommended: 0,
    bestScore: {val: 0},
    defaultComparer: datesChallenge.datesEqual, /* function used to judge if answer is correct */
    defaultSolution: datesChallenge.cameFirst,
    scoring: [{level: 0},
        {level: 1, time: 60*45, keystrokes: 3000},
        {level: 2, time: 60*20,  keystrokes: 1900}],
    steps: [
    { // todo go over testcases for each and make sure all variants are well-covered
        // todo move all expected to avg color
        id: 0,
        story: "Put a story here!",
        description: "You will receive two strings representing dates in mm-dd-yyyy format (or mm/dd/yyyy format). Return a Date object of whichever date is earlier chronologically.",
        addFunction: ['cameFirst', 'date1', 'date2'],
        demoTests: [['10-15-2013', '10/17/2013']],
        tests: [['10-15-2013', '10/17/2013'], ['4/5/2012', '4-3-2011'], ["3/3/2013","3-3-2013"]  ] /*   */
    },
    {
        id: 1,
        description: "You will recieve two strings representing dates. Each will be one of the following: a unix timestamp, mm-dd-yyyy, yyyy-mm-dd, yyyy/mm/dd, or mm/dd/yyyyy. Return a a date object representing the date that came first.",
        /*addFunction: ['mixColors', 'color1', 'color2', 'balance'],*/
        defaultTestee: "cameFirst",
        demoTests: [["1357027200","2013/01/02"]],
        tests: [["135702720","2013/01/02"], ["2013-01-02", "1357027200"], ['1357027200', '1357027201'], ],
    },
    {
        id: 2,
        description: "You will receive a timestamp. It will be within 15 seconds of the start of a day (i.e. 12:00 AM) in either direction. Round it to the nearest full day (i.e. 12:00 AM) and return that as a unix timestamp. ",
        addFunction: ['nearestDate', 'timestamp'],
        defaultTestee: 'nearestDate',
        defaultSolution: datesChallenge.nearbyDate,
        demoTests: [['1357027201']],
        tests: [['1357027201', '1357027200', '1357027199']] /* answer followed by sets of parameters */
    },
    {
        id: 3,
        description: "You will receive dates in the format: MonthName day, year. However, there may be typos in the month name. The capitalizaiton may be incorrect and there may be one letter added or letter missing from the month name (but not both). Parse this string into a date-object.",
        addFunction: ['typoDate', 'incorrectDate'],
        defaultSolution: datesChallenge.correctDate,
        demoTests: [['mAzy 3 2013']],
        tests: [['mAzy 3, 2013'], ['aprl 1, 2011'], ['apriil 5, 2013'], ['marchy 5, 2013'], ['juney 5, 2013'], ['ZdecemBER 22, 1985'] ],
    },
    ], //</steps>
   },
    {
        name: "Mixology",
        id: '2-mixology',
        description: "Challenges around mixing colors",
        defaultComparer: striCompare, /* function used to judge if answer is correct */
        defaultSolution: avgColor,
        difficulty: 'Harder',
        bestScore: {val: 0},
        difficultyColor: avgColor("BB0", "B00", .70),
        recommended: 0,
        scoring: [{level: 0},
            {level: 1, time: 120*60, keystrokes: 5000},
            {level: 2, time: 60*60,  keystrokes: 2500}],
        steps: [
            { // todo go over testcases for each and make sure all variants are well-covered
                // todo move all expected to avg color
                id: 0,
                story: "Put a story here!",
                description: "Given two 6-digit strings that each represent a color in RGB hex notation, find a color that is the average of the two. This can be done by averaging the Red, Green, and Blue pieces of the color. Return this color in 6 digit string using hex RGB notation. Round down when rounding is necessary. ",
                addFunction: ['averageColors', 'color1', 'color2'],
                demoTests: [['11BB10', '33DD12']],
                tests: [['ffffff', '000000' ], ['123456', 'AAAAAA'], ["000000","111111"]  ] /*   */
            },
            {
                id: 1,
                description: "Instead of simply averaging, now allow for a balance anywhere on the scale of mixtures. A third parameter \"balance\" will be passed which ranges from 0 to 1 to indicate the % balance of color1 and color2 to mix. When balance is 0, this indicates only to use color1, when balance is 1 it indicates only to use color2, and .5 would indicate an equal balance",
                addFunction: ['mixColors', 'color1', 'color2', 'balance'],
                demoTests: [["000000","444444",.75]],
                tests: [['ffffff', '000000', .5 ], ['000000', 'afeff1', 1 ], ['F0010F', 'F0010F', .1234], ['F0010F', 'FFF000', 0]  ] /* answer followed by sets of parameters */
            },
            {
                id: 2,
                description: "Most modern browsers now allow for a 3-digit hex notation for some colors. Support this notation as an input in your existing and future functions (but continue to always return 6 digit notation). For example, '9AB' represents '99AABB' etc.",
                /* NA addFunction: ['mixColors', 'color1', 'color2', 'balance'], */
                defaultTestee: 'mixColors',
                demoTests: [['000', '444', .75]],
                tests: [['000', 'FFF', .5 ], ['111', '333', .5 ], ['F0010F', 'F0010F', .1234], ['F0010F', 'FFF000', 0]  ] /* answer followed by sets of parameters */
            },
            {
                id: 3,
                description: "Now define a function to do an equal 3-way-mix",
                addFunction: ['menageaTrois', 'color1', 'color2', 'color3'],
                defaultSolution: threeWay,
                demoTests: [['000','111','222']],
                tests: [['000','111','222'], ['109','249','6B9'] ],
            },
            {
                id: 4,
                description: "Now make all three functions work with input colors defined as arrays of numbers that represent percentages. " +
                    " For example red would be [100,0,0] instead of FF0000. In addition, those functions must still work with the old input format as well. Continue to return your result as 6-digit hex. ",
                demoTests: [{testee: 'mixColors', params: [[0,0,0], [100,100,100]], solver: avgColor},
                    {testee: 'mixColors', params: ["000000", "ffffff"], solver: avgColor},
                ],
                tests: [{testee: "menageaTrois", params: [[12, 23, 34], [34, 45, 67],[55, 33, 11]], solver: threeWay},
                    {testee: 'averageColors', params:[[0,0,0], [100,0,50]], solver: avgColor},
                    {testee: 'mixColors', params: [[10,10,10],[30,30,30],.3], solver: avgColor },
                    {testee: "menageaTrois", params: ["a1b2c3", "002200", "51f5FF"], solver: threeWay},
                    {testee: 'averageColors', params:["000000", "ff007f"], solver: avgColor},
                    {testee: 'mixColors', params: ["0A0A0A", "1D1D1D",.3], solver: avgColor},
                ],
            }
        ], //</steps>
    },
 ];

EXPORT.loadBestScores = function(){
    var challengeSet = EXPORT.challengeSet;
    var rekey = function(arr, key) {
       return _.object(FA(arr).pluck(key), arr);
    };
    var lookup = rekey(challengeSet, "id");
    return PersistentStorage.loadScores().then(function(scores){
           for (var x = 0; x < scores.length; x++) {
                lookup[ scores.item(x)['challenge_id'] ].bestScore.val = scores.item(x)['top_score'] + 1;
           }
    }); //return a promise
};
