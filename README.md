WikiMate
==============================

WikiMate is a sectional wiki content editor inspired by Smallest-Federated-Wiki project.

Demo & Try it out
------------------------------

http://xli.github.com/wikimate/

Basic Usage
------------------------------

    $('#wiki').wikimate({
      // Story is a Javascript Array that contains story items
      // see the Data Structure section for details
      story: [... story items ...],
      // Callback when a change action happened (add, edit/delete story item)
      change: function(event, action) {
        // save the action as you need
        save(action)
        // get the updated story.........
        var newStory = $('#wiki').wikimate('story');
        .........
      }
    });

Tell wikimate to render story journal:

    // Journal is a Javascript Array that contains action objects
    // see the Data Structure section for details
    var journal = ... 
    $('#wiki').wikimate('journal', journal);

    // To get the up-to-date journal
    var newJournal = $('#wiki').wikimate('journal');

Build Package
-------------------------------

    rake

Or

    make build

A dist directory will be created with everything inside.
A packaged_demo.html is also inside dist for how to use.

Dependency
-------------------------------

JavaScript:

* jquery-1.7.2.js
* underscore-1.3.1.js
* jquery-ui-1.8.18.custom.min.js for image plugin
* diff.js for journal module
* tiny_mce 3.4.9 for rdoc plugin

Package:

* jshint & uglifyjs

