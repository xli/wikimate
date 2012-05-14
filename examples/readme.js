var readme = {
    "story": [{
        "id": "8f21586c7380205f",
        "type": "markdown",
        "text": "WikiMate\n==============================\n"
    },
    {
        "id": "8524af05b5fde8ff",
        "type": "markdown",
        "text": "WikiMate is a sectional wiki content editor inspired by Smallest-Federated-Wiki project.\n"
    },
    {
        "id": "e59693b0bc18bbf4",
        "type": "markdown",
        "text": "Demo & Try it out\n------------------------------\n\n<http://xli.github.com/wikimate/>"
    },
    {
        "id": "99c15c21d66b4fb4",
        "type": "markdown",
        "text": "User Reference\n--------\n"
    },
    {
        "id": "24020fa8a7a387f9",
        "type": "markdown",
        "text": "* Double click to create/edit a section\n* Default section type is [Markdown](http://daringfireball.net/projects/markdown/)\n"
    },
    {
        "id": "27b016308f2e7952",
        "type": "markdown",
        "text": "Developer Reference\n----------"
    },
    {
        "id": "3ecaf8fb7f1379cb",
        "type": "markdown",
        "text": "### Basic Usage"
    },
    {
        "id": "0fe3205652a06255",
        "type": "markdown",
        "text": "    $('#wiki').wikimate({\n      // Story is a Javascript Array that contains story items\n      // see the Data Structure section for details\n      story: [... story items ...],\n      // Callback when a change action happened (add, edit/delete story item)\n      change: function(event, action) {\n        // save the action as you need\n        save(action)\n        // get the updated story.........\n        var newStory = $('#wiki').wikimate('story');\n        .........\n      }\n    });\n"
    },
    {
        "id": "a93756e6792625e2",
        "type": "markdown",
        "text": "### Tell wikimate to render story journal"
    },
    {
        "id": "a113f6ad8e241500",
        "type": "markdown",
        "text": "    // Journal is a Javascript Array that contains action objects\n    // see the Data Structure section for details\n    var journal = ... \n    $('#wiki').wikimate('journal', journal);\n\n    // To get the up-to-date journal\n    var newJournal = $('#wiki').wikimate('journal');\n"
    },
    {
        "id": "d1d23991c784a8ec",
        "type": "markdown",
        "text": "### More Details: <https://github.com/xli/wikimate/wiki>"
    }],
    "journal": [{
        "id": "8f21586c7380205f",
        "type": "add",
        "item": {
            "id": "8f21586c7380205f",
            "type": "markdown",
            "text": "WikiMate\n==============================\n"
        }
    },
    {
        "id": "8524af05b5fde8ff",
        "type": "add",
        "item": {
            "id": "8524af05b5fde8ff",
            "type": "markdown",
            "text": "WikiMate is a sectional wiki content editor inspired by Smallest-Federated-Wiki project.\n"
        },
        "after": "8f21586c7380205f"
    },
    {
        "id": "e59693b0bc18bbf4",
        "type": "add",
        "item": {
            "id": "e59693b0bc18bbf4",
            "type": "markdown",
            "text": "Demo & Try it out\n------------------------------\n\nhttp://xli.github.com/wikimate/\n"
        },
        "after": "8524af05b5fde8ff"
    },
    {
        "id": "e59693b0bc18bbf4",
        "type": "edit",
        "item": {
            "id": "e59693b0bc18bbf4",
            "type": "markdown",
            "text": "Demo & Try it out\n------------------------------\n\n[http://xli.github.com/wikimate/](http://xli.github.com/wikimate/)"
        }
    },
    {
        "id": "3ecaf8fb7f1379cb",
        "type": "add",
        "item": {
            "id": "3ecaf8fb7f1379cb",
            "type": "markdown",
            "text": "Basic Usage\n------------------------------\n"
        },
        "after": "e59693b0bc18bbf4"
    },
    {
        "id": "e59693b0bc18bbf4",
        "type": "edit",
        "item": {
            "id": "e59693b0bc18bbf4",
            "type": "markdown",
            "text": "Demo & Try it out\n------------------------------\n\n<http://xli.github.com/wikimate/>"
        }
    },
    {
        "id": "0fe3205652a06255",
        "type": "add",
        "item": {
            "id": "0fe3205652a06255",
            "type": "markdown",
            "text": "    $('#wiki').wikimate({\n      // Story is a Javascript Array that contains story items\n      // see the Data Structure section for details\n      story: [... story items ...],\n      // Callback when a change action happened (add, edit/delete story item)\n      change: function(event, action) {\n        // save the action as you need\n        save(action)\n        // get the updated story.........\n        var newStory = $('#wiki').wikimate('story');\n        .........\n      }\n    });\n"
        },
        "after": "3ecaf8fb7f1379cb"
    },
    {
        "id": "a93756e6792625e2",
        "type": "add",
        "item": {
            "id": "a93756e6792625e2",
            "type": "markdown",
            "text": "Tell wikimate to render story journal:"
        },
        "after": "0fe3205652a06255"
    },
    {
        "id": "a113f6ad8e241500",
        "type": "add",
        "item": {
            "id": "a113f6ad8e241500",
            "type": "markdown",
            "text": "    // Journal is a Javascript Array that contains action objects\n    // see the Data Structure section for details\n    var journal = ... \n    $('#wiki').wikimate('journal', journal);\n\n    // To get the up-to-date journal\n    var newJournal = $('#wiki').wikimate('journal');\n"
        },
        "after": "a93756e6792625e2"
    },
    {
        "id": "27b016308f2e7952",
        "type": "add",
        "item": {
            "id": "27b016308f2e7952",
            "type": "markdown",
            "text": "More details: <https://github.com/xli/wikimate/wiki>\n----------"
        },
        "after": "a113f6ad8e241500"
    },
    {
        "id": "99c15c21d66b4fb4",
        "type": "add",
        "item": {
            "id": "99c15c21d66b4fb4",
            "type": "markdown",
            "text": "Guideline\n--------\n"
        },
        "after": "27b016308f2e7952"
    },
    {
        "id": "24020fa8a7a387f9",
        "type": "add",
        "item": {
            "id": "24020fa8a7a387f9",
            "type": "markdown",
            "text": "* Double click to create/edit a section\n* Default section type is Markdown\n"
        },
        "after": "99c15c21d66b4fb4"
    },
    {
        "id": "99c15c21d66b4fb4",
        "type": "edit",
        "item": {
            "id": "99c15c21d66b4fb4",
            "type": "markdown",
            "text": "User Reference\n--------\n"
        }
    },
    {
        "id": "27b016308f2e7952",
        "type": "edit",
        "item": {
            "id": "27b016308f2e7952",
            "type": "markdown",
            "text": "Developer Reference\n----------\n<https://github.com/xli/wikimate/wiki>"
        }
    },
    {
        "id": "27b016308f2e7952",
        "type": "move",
        "order": ["8f21586c7380205f", "8524af05b5fde8ff", "e59693b0bc18bbf4", "3ecaf8fb7f1379cb", "0fe3205652a06255", "a93756e6792625e2", "a113f6ad8e241500", "99c15c21d66b4fb4", "24020fa8a7a387f9", "27b016308f2e7952"]
    },
    {
        "id": "99c15c21d66b4fb4",
        "type": "move",
        "order": ["8f21586c7380205f", "8524af05b5fde8ff", "e59693b0bc18bbf4", "99c15c21d66b4fb4", "3ecaf8fb7f1379cb", "0fe3205652a06255", "a93756e6792625e2", "a113f6ad8e241500", "24020fa8a7a387f9", "27b016308f2e7952"]
    },
    {
        "id": "24020fa8a7a387f9",
        "type": "move",
        "order": ["8f21586c7380205f", "8524af05b5fde8ff", "e59693b0bc18bbf4", "99c15c21d66b4fb4", "24020fa8a7a387f9", "3ecaf8fb7f1379cb", "0fe3205652a06255", "a93756e6792625e2", "a113f6ad8e241500", "27b016308f2e7952"]
    },
    {
        "id": "27b016308f2e7952",
        "type": "move",
        "order": ["8f21586c7380205f", "8524af05b5fde8ff", "e59693b0bc18bbf4", "99c15c21d66b4fb4", "24020fa8a7a387f9", "27b016308f2e7952", "3ecaf8fb7f1379cb", "0fe3205652a06255", "a93756e6792625e2", "a113f6ad8e241500"]
    },
    {
        "id": "27b016308f2e7952",
        "type": "edit",
        "item": {
            "id": "27b016308f2e7952",
            "type": "markdown",
            "text": "Developer Reference\n----------"
        }
    },
    {
        "id": "3ecaf8fb7f1379cb",
        "type": "edit",
        "item": {
            "id": "3ecaf8fb7f1379cb",
            "type": "markdown",
            "text": "### Basic Usage"
        }
    },
    {
        "id": "a93756e6792625e2",
        "type": "edit",
        "item": {
            "id": "a93756e6792625e2",
            "type": "markdown",
            "text": "### Tell wikimate to render story journal"
        }
    },
    {
        "id": "d1d23991c784a8ec",
        "type": "add",
        "item": {
            "id": "d1d23991c784a8ec",
            "type": "markdown",
            "text": "### More: <https://github.com/xli/wikimate/wiki>"
        },
        "after": "a113f6ad8e241500"
    },
    {
        "id": "d1d23991c784a8ec",
        "type": "edit",
        "item": {
            "id": "d1d23991c784a8ec",
            "type": "markdown",
            "text": "### More Details: <https://github.com/xli/wikimate/wiki>"
        }
    },
    {
        "id": "24020fa8a7a387f9",
        "type": "edit",
        "item": {
            "id": "24020fa8a7a387f9",
            "type": "markdown",
            "text": "* Double click to create/edit a section\n* Default section type is [Markdown](http://daringfireball.net/projects/markdown/)\n"
        }
    }]
};