var wiki = {
    "story": [{
        "id": "437086e87275336e",
        "type": "paragraph",
        "text": "<h1>WikiMate</h1>\n"
    },
    {
        "id": "2d78efa2f9971d5e",
        "type": "paragraph",
        "text": "WikiMate is a sectional wiki content editor inspired by Smallest-Federated-Wiki project."
    },
    {
        "id": "eaea4bfa1cd5569c",
        "type": "paragraph",
        "text": "<h2>Demo & Try it out</h2>\n"
    },
    {
        "id": "deceb95a7f4bb242",
        "type": "paragraph",
        "text": "http://xli.github.com/wikimate/"
    },
    {
        "id": "db8dce1fd4e09428",
        "type": "paragraph",
        "text": "<h2>Basic Usage</h2>\n"
    },
    {
        "id": "f719c5007565facc",
        "type": "paragraph",
        "text": "<pre><code>\n$('#wiki').wikimate({\n  // Story is a Javascript Array that contains story items\n  // see the Data Structure section for details\n  story: [... story items ...],\n  // Callback when a change action happened (add, edit/delete story item)\n  change: function(event, action) {\n    // save the action as you need\n    save(action)\n    // get the updated story.........\n    var newStory = $('#wiki').wikimate('story');\n    .........\n  }\n});</code></pre>"
    },
    {
        "id": "eec3a4385b3d192d",
        "type": "paragraph",
        "text": "Tell wikimate to render story journal:\n"
    },
    {
        "id": "4aad94dfb1ab6c2d",
        "type": "paragraph",
        "text": "<pre><code>\n// Journal is a Javascript Array that contains action objects\n// see the Data Structure section for details\nvar journal = ... \n$('#wiki').wikimate('journal', journal);\n\n// To get the up-to-date journal\nvar newJournal = $('#wiki').wikimate('journal');</code></pre>"
    }],
    "journal": [{
        "id": "437086e87275336e",
        "type": "add",
        "item": {
            "id": "437086e87275336e",
            "type": "paragraph",
            "text": "<h1>WikiMate</h1>\n"
        }
    },
    {
        "id": "437086e87275336e",
        "type": "edit",
        "item": {
            "id": "437086e87275336e",
            "type": "paragraph",
            "text": "<h2>WikiMate</h2>\n"
        }
    },
    {
        "id": "437086e87275336e",
        "type": "edit",
        "item": {
            "id": "437086e87275336e",
            "type": "paragraph",
            "text": "<h1>WikiMate</h1>\n"
        }
    },
    {
        "id": "2d78efa2f9971d5e",
        "type": "add",
        "item": {
            "id": "2d78efa2f9971d5e",
            "type": "paragraph",
            "text": "WikiMate is a sectional wiki content editor inspired by Smallest-Federated-Wiki project."
        },
        "after": "437086e87275336e"
    },
    {
        "id": "eaea4bfa1cd5569c",
        "type": "add",
        "item": {
            "id": "eaea4bfa1cd5569c",
            "type": "paragraph",
            "text": "<h2>Demo & Try it out</h2>\n"
        },
        "after": "2d78efa2f9971d5e"
    },
    {
        "id": "deceb95a7f4bb242",
        "type": "add",
        "item": {
            "id": "deceb95a7f4bb242",
            "type": "paragraph",
            "text": "http://xli.github.com/wikimate/"
        },
        "after": "eaea4bfa1cd5569c"
    },
    {
        "id": "db8dce1fd4e09428",
        "type": "add",
        "item": {
            "id": "db8dce1fd4e09428",
            "type": "paragraph",
            "text": "<h2>Basic Usage</h2>\n"
        },
        "after": "deceb95a7f4bb242"
    },
    {
        "id": "f719c5007565facc",
        "type": "add",
        "item": {
            "id": "f719c5007565facc",
            "type": "paragraph",
            "text": "<pre><code>\n    $('#wiki').wikimate({\n      // Story is a Javascript Array that contains story items\n      // see the Data Structure section for details\n      story: [... story items ...],\n      // Callback when a change action happened (add, edit/delete story item)\n      change: function(event, action) {\n        // save the action as you need\n        save(action)\n        // get the updated story.........\n        var newStory = $('#wiki').wikimate('story');\n        .........\n      }\n    });\n</code></pre>"
        },
        "after": "db8dce1fd4e09428"
    },
    {
        "id": "eec3a4385b3d192d",
        "type": "add",
        "item": {
            "id": "eec3a4385b3d192d",
            "type": "paragraph",
            "text": "Tell wikimate to render story journal:\n"
        },
        "after": "f719c5007565facc"
    },
    {
        "id": "4aad94dfb1ab6c2d",
        "type": "add",
        "item": {
            "id": "4aad94dfb1ab6c2d",
            "type": "paragraph",
            "text": "<pre><code>\n\n    // Journal is a Javascript Array that contains action objects\n    // see the Data Structure section for details\n    var journal = ... \n    $('#wiki').wikimate('journal', journal);\n\n    // To get the up-to-date journal\n    var newJournal = $('#wiki').wikimate('journal');\n"
        },
        "after": "eec3a4385b3d192d"
    },
    {
        "id": "4aad94dfb1ab6c2d",
        "type": "edit",
        "item": {
            "id": "4aad94dfb1ab6c2d",
            "type": "paragraph",
            "text": "<pre><code>\n\n    // Journal is a Javascript Array that contains action objects\n    // see the Data Structure section for details\n    var journal = ... \n    $('#wiki').wikimate('journal', journal);\n\n    // To get the up-to-date journal\n    var newJournal = $('#wiki').wikimate('journal');\n</code></pre>"
        }
    },
    {
        "id": "9fce83bf77673c88",
        "type": "add",
        "item": {
            "id": "9fce83bf77673c88",
            "type": "paragraph",
            "text": "<h2>Data Structure</h2>\n"
        },
        "after": "4aad94dfb1ab6c2d"
    },
    {
        "id": "15ada0d42b9dea50",
        "type": "add",
        "item": {
            "id": "15ada0d42b9dea50",
            "type": "paragraph",
            "text": "WikiMate uses similar data structure that Smallest-Federated-Wiki uses to create wiki:\n<h3>Story, Array, a list of story items.</h3>\n<h4>Story item is an editable section in wiki content.</h4>\n"
        },
        "after": "9fce83bf77673c88"
    },
    {
        "id": "729e6c43fef4bb55",
        "type": "add",
        "item": {
            "id": "729e6c43fef4bb55",
            "type": "paragraph",
            "text": "<pre><code>\n\n     id: unique string id\n     type: name of plugin used for rendering and editing the item\n     text: text content of the item\n</code></pre>"
        },
        "after": "15ada0d42b9dea50"
    },
    {
        "id": "3a67fea2fb6e826c",
        "type": "add",
        "item": {
            "id": "3a67fea2fb6e826c",
            "type": "paragraph",
            "text": "  Story item may have some other attributes designed by the plugin, for example: layout item has a story attribute, which is a list of story items inside the layout.\n"
        },
        "after": "729e6c43fef4bb55"
    },
    {
        "id": "4538bd2f59939f3e",
        "type": "add",
        "item": {
            "id": "4538bd2f59939f3e",
            "type": "paragraph",
            "text": "<h3>Journal, Array, a list of actions. Journal is optional.</h3>\n<h4>Action data structure:</h4>\n"
        },
        "after": "3a67fea2fb6e826c"
    },
    {
        "id": "50dca28eeb9a2b96",
        "type": "add",
        "item": {
            "id": "50dca28eeb9a2b96",
            "type": "paragraph",
            "text": "<pre><code>\n\n    id: unique string id, from the item id\n    type: 'add', 'edit', 'remove', 'move'\n    item: optional, add/edit action has this attribute\n    after: an item id, identify the position of the item that action is related.\n    inside: a layout item id, identify the position of the item that action is related.\n    order: a list of item id that presents order of all of items in a layout after item moved.\n"
        },
        "after": "4538bd2f59939f3e"
    },
    {
        "id": "50dca28eeb9a2b96",
        "type": "edit",
        "item": {
            "id": "50dca28eeb9a2b96",
            "type": "paragraph",
            "text": "<pre><code>\n    id: unique string id, from the item id\n    type: 'add', 'edit', 'remove', 'move'\n    item: optional, add/edit action has this attribute\n    after: an item id, identify the position of the item that action is related.\n    inside: a layout item id, identify the position of the item that action is related.\n    order: a list of item id that presents order of all of items in a layout after item moved.\n</code></pre>"
        }
    },
    {
        "id": "f719c5007565facc",
        "type": "edit",
        "item": {
            "id": "f719c5007565facc",
            "type": "paragraph",
            "text": "<code>\n    $('#wiki').wikimate({\n      // Story is a Javascript Array that contains story items\n      // see the Data Structure section for details\n      story: [... story items ...],\n      // Callback when a change action happened (add, edit/delete story item)\n      change: function(event, action) {\n        // save the action as you need\n        save(action)\n        // get the updated story.........\n        var newStory = $('#wiki').wikimate('story');\n        .........\n      }\n    });\n</code>"
        }
    },
    {
        "id": "f719c5007565facc",
        "type": "edit",
        "item": {
            "id": "f719c5007565facc",
            "type": "paragraph",
            "text": "<pre><code>\n$('#wiki').wikimate({\n  // Story is a Javascript Array that contains story items\n  // see the Data Structure section for details\n  story: [... story items ...],\n  // Callback when a change action happened (add, edit/delete story item)\n  change: function(event, action) {\n    // save the action as you need\n    save(action)\n    // get the updated story.........\n    var newStory = $('#wiki').wikimate('story');\n    .........\n  }\n});\n</code></pre>"
        }
    },
    {
        "id": "4aad94dfb1ab6c2d",
        "type": "edit",
        "item": {
            "id": "4aad94dfb1ab6c2d",
            "type": "paragraph",
            "text": "<pre><code>\n// Journal is a Javascript Array that contains action objects\n// see the Data Structure section for details\nvar journal = ... \n$('#wiki').wikimate('journal', journal);\n\n// To get the up-to-date journal\nvar newJournal = $('#wiki').wikimate('journal');\n</code></pre>"
        }
    },
    {
        "id": "729e6c43fef4bb55",
        "type": "edit",
        "item": {
            "id": "729e6c43fef4bb55",
            "type": "paragraph",
            "text": "<pre><code>\nid: unique string id\ntype: name of plugin used for rendering and editing the item\ntext: text content of the item\n</code></pre>"
        }
    },
    {
        "id": "50dca28eeb9a2b96",
        "type": "edit",
        "item": {
            "id": "50dca28eeb9a2b96",
            "type": "paragraph",
            "text": "<pre><code>\nid: unique string id, from the item id\ntype: 'add', 'edit', 'remove', 'move'\nitem: optional, add/edit action has this attribute\nafter: an item id, identify the position of the item that action is related.\ninside: a layout item id, identify the position of the item that action is related.\norder: a list of item id that presents order of all of items in a layout after item moved.\n</code></pre>"
        }
    },
    {
        "id": "f719c5007565facc",
        "type": "edit",
        "item": {
            "id": "f719c5007565facc",
            "type": "paragraph",
            "text": "<pre><code>\n$('#wiki').wikimate({\n  // Story is a Javascript Array that contains story items\n  // see the Data Structure section for details\n  story: [... story items ...],\n  // Callback when a change action happened (add, edit/delete story item)\n  change: function(event, action) {\n    // save the action as you need\n    save(action)\n    // get the updated story.........\n    var newStory = $('#wiki').wikimate('story');\n    .........\n  }\n});</code></pre>"
        }
    },
    {
        "id": "4aad94dfb1ab6c2d",
        "type": "edit",
        "item": {
            "id": "4aad94dfb1ab6c2d",
            "type": "paragraph",
            "text": "<pre><code>\n// Journal is a Javascript Array that contains action objects\n// see the Data Structure section for details\nvar journal = ... \n$('#wiki').wikimate('journal', journal);\n\n// To get the up-to-date journal\nvar newJournal = $('#wiki').wikimate('journal');</code></pre>"
        }
    },
    {
        "id": "729e6c43fef4bb55",
        "type": "edit",
        "item": {
            "id": "729e6c43fef4bb55",
            "type": "paragraph",
            "text": "<pre><code>\nid: unique string id\ntype: name of plugin used for rendering and editing the item\ntext: text content of the item</code></pre>"
        }
    },
    {
        "id": "50dca28eeb9a2b96",
        "type": "edit",
        "item": {
            "id": "50dca28eeb9a2b96",
            "type": "paragraph",
            "text": "<pre><code>\nid: unique string id, from the item id\ntype: 'add', 'edit', 'remove', 'move'\nitem: optional, add/edit action has this attribute\nafter: an item id, identify the position of the item that action is related.\ninside: a layout item id, identify the position of the item that action is related.\norder: a list of item id that presents order of all of items in a layout after item moved.</code></pre>"
        }
    },
    {
        "id": "50dca28eeb9a2b96",
        "type": "remove"
    },
    {
        "id": "4538bd2f59939f3e",
        "type": "remove"
    },
    {
        "id": "3a67fea2fb6e826c",
        "type": "remove"
    },
    {
        "id": "15ada0d42b9dea50",
        "type": "remove"
    },
    {
        "id": "729e6c43fef4bb55",
        "type": "remove"
    },
    {
        "id": "9fce83bf77673c88",
        "type": "remove"
    }]
}

function view(title, codeText) {
  var code = $('<pre/>').text(codeText);
  $('<div/>').append(code).dialog({
    title: title,
    model: true,
    width: '90%'
  })
}

$(document).ready(function() {
  $('#undo').click(function(e) {
    $('#wiki').wikimate('undo');
  });
  $('#view_source').click(function(e) {
    // view("Source Code to initialize the editor", "var wiki = " + JSON.stringify(wiki, null, 2) + "\n$('#wiki').empty().wikimate({ story: wiki.story }).wikimate('journal', wiki.journal);");
    $.ajax({
      url: 'javascripts/main.js',
      dataType: 'script',
      success: function(r) {
        console.log(r);
        view("Source Code to initialize the editor", r.responseText);
      }
    })
  });
  $('#view_story').click(function(e) {
    view("Story: $('#wiki').wikimate('story')", JSON.stringify($('#wiki').wikimate('story'), null, 2));
  });
  $('#view_journal').click(function(e) {
    view("Journal: $('#wiki').wikimate('journal')", JSON.stringify($('#wiki').wikimate('journal'), null, 2));
  });
  $('#wiki').empty().wikimate({ story: wiki.story }).wikimate('journal', wiki.journal);
});
