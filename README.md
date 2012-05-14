WikiMate
==============================

WikiMate is a sectional wiki content editor inspired by Smallest-Federated-Wiki project.

Demo & Try it out
------------------------------

<http://xli.github.com/wikimate/>

User Reference
--------

* Double click to create/edit a section
* Default section type is [Markdown](http://daringfireball.net/projects/markdown/)

Developer Reference
----------

### Basic Usage
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

### Tell wikimate to render story journal

    // Journal is a Javascript Array that contains action objects
    // see the Data Structure section for details
    var journal = ... 
    $('#wiki').wikimate('journal', journal);

    // To get the up-to-date journal
    var newJournal = $('#wiki').wikimate('journal');

### More Details: <https://github.com/xli/wikimate/wiki>

Download Package
-------------------------------

https://github.com/downloads/xli/wikimate/wikimate-0.1.zip

See packaged_demo.html as example for how to use in your application.

Build Package
-------------------------------

    rake

Or

    make build

A dist directory will be created with everything inside.
A packaged_demo.html is also inside dist directory for how to use.

Dependency
-------------------------------

JavaScript:

* jquery-1.7.2.js
* underscore-1.3.1.js
* jquery-ui-1.8.18.custom.min.js for image plugin
* diff.js for journal module
* tiny_mce 3.4.9 for rdoc plugin
* showdown.js for markdown plugin

Package:

* jshint & uglifyjs

