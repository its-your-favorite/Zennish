guiders.createGuider({
    attachTo: "#submitCode",
    position: "6",
    description: "Once you're confident your code is right you can submit it. Think of this as deploying your code, only submit it when you're confident it works. Handing off bad code can affect your score. <BR><BR>Now, with that, you should be all set to do step one.",
    buttons: [{name: "Close"}],
    id:"g04",
    overlay: true,
    title: "When it's done",

} );

guiders.createGuider({
    attachTo: "#runAllTests",
    position: "9",
    description: "After you've written that code you'll probably want to test it. Simply click the 'Run All' button to ensure all of your tests are passing.",
    buttons: [{name: "Next"}],
    id:"g03",
    overlay: true,
    title: "Testing it",
    next:"g04"

} );

guiders.createGuider({ attachTo: ".CodeMirror-lines",
        position: "6",
        buttons: [{name: "Next"}],
        description: "This box will serve as your IDE for challenges. Type in it like a normal ide. You just need to \"fill in the code\" to make the function work as intended. In problem 1, that simply means entering 'return 3;'",
        id:"g02",
        overlay: true,
        title: "Entering code",
        next: "g03"
    }
);

var guiderScript1 = guiders.createGuider({
        attachTo: ".stepDescription",
        position: "3",
        buttons: [{name: "Next"}],
        description: "Your challenges will be described in this box over here. They explain the basic problem to solve.",
        id:"g01",
        overlay: true,
        title: "Getting started",
        next: "g02"
    }
);

guiders.createGuider({
        attachTo: ".testParams",
        position: "9",
        buttons: [{name: "Close"}],
        description: "You can test any values you want. Sorry! Was that obvious? Sorry if I'm pestering you, I just <em>really</em> like helping people. I'll go away now!",
        id:"g02.03",
        overlay: true,
        title: "Customizing tests",
    }
);

guiders.createGuider({
        attachTo: "#addNewTest",
        position: "9",
        buttons: [{name: "Next"}],
        description: "You can add your own tests by clicking here.",
        id:"g02.02",
        overlay: true,
        title: "Writing your own tests",
        next: "g02.03"
    }
);

var guiderScript2 = guiders.createGuider({
        attachTo: ".active.challengeStep",
        position: "3",
        buttons: [{name: "Next"}],
        description: "Great, you solved it. Now onto this next step! Notice the keystrokes and time-spent are counted for each step.",
        id:"g02.01",
        overlay: true,
        title: "Step two",
        next: "g02.02"
    }
);

var guiderScript3 = guiders.createGuider({
        /*attachTo: ".active.challengeStep",*/
        position: "3",
        buttons: [{name: "Close"}],
        description: "I ALMOST FORGOT! One last thing! I recommend you open your Chrome Console for useful information and even to debug your code. I assume you know what the Chrome Console is... If not don't worry about it!",
        id:"g03.01",
        overlay: true,
        title: "Developer Console"
    }
);
