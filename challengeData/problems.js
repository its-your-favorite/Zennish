var EXPORT = EXPORT || {};
EXPORT.challengeSet = [
{
    name: "Mixology",
    id: '0-mixology',
    description: "Challenges around mixing colors",
    defaultComparer: striCompare, /* function used to judge if answer is correct */
    defaultSolution: avgColor,
    scoring: [{level: 0},
        {level: 1, time: 120, keystrokes: 5000},
        {level: 2, time: 60,  keystrokes: 2500}],
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
    {
        name: "Matching",
        id: '2-matching',
        description: "Challenges around patterns in cards",
        defaultComparer: striCompare, /* function used to judge if answer is correct */
        defaultSolution: avgColor,
        scoring: [{level: 1}],
        steps: [
        ],

    }   ,
{
    name: "Let's Play Tag",
    id: '1-tag',
    description: "Challenges around a tag system",
    defaultComparer: striCompare, /* function used to judge if answer is correct */
    defaultSolution: avgColor,
    steps: [
    {
        id: 0,
        story: "Put a story here!",
        description: "",
        addFunction: ['averageColors', 'color1', 'color2'],
        tests: [['ffffff', '000000' ], ['123456', 'AAAAAA']  ] /* answer followed by sets of parameters */
    },
    {
        id: 1,
        description: "Instead of simply averaging, now allow for a balance anywhere on the scale of mixtures. A third parameter \"balance\" will be passed which ranges from 0 to 1 to indicate the % balance of color1 and color2 to mix. When balance is 0, this indicates only to use color1, when balance is 1 it indicates only to use color2, and .5 would indicate an equal balance",
        addFunction: ['mixColors', 'color1', 'color2', 'balance'],
        tests: [['ffffff', '000000', .5 ], ['000000', 'afeff1', 1 ], ['F0010F', 'F0010F', .1234], ['F0010F', 'FFF000', 0]  ] /* answer followed by sets of parameters */
    },
    {
        id: 2,
        description: "Most modern browsers now allow for a 3-digit hex notation for some colors. Support this notation as an input in your existing and future functions (but continue to always return 6 digit notation).",
        /* NA addFunction: ['mixColors', 'color1', 'color2', 'balance'], */
        defaultTestee: 'mixColors',
        tests: [['000', 'FFF', .5 ], ['111', '333', .5 ], ['F0010F', 'F0010F', .1234], ['F0010F', 'FFF000', 0]  ] /* answer followed by sets of parameters */
    },
    {
        id: 3,
        description: "Now define a function to do an equal 3-way-mix",
        addFunction: ['menageaTrois', 'color1', 'color2', 'color3'],
        defaultSolution: threeWay,
        tests: [['000','111','222'], ['109','249','6B9'] ],
    },
    {
        id: 4,
        description: "Now make all three functions work with colors defined as arrays of numbers that represent percentages. For example red would be [100,0,0] instead of FF0000 ",
        tests: [{testee: "menageaTrois", params: [[12, 23, 34], [34, 45, 67],[55, 33, 11]], solver: threeWay},
            {testee: 'averageColors', params:[[0,0,0], [100,0,50]], solver: avgColor},
            {testee: 'mixColors', params: [[10,10,10],[30,30,30],.3], solver: avgColor } ]
    }
], //</steps>
}
];