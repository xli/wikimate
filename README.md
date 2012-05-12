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

Data Structure
-------------------------------

WikiMate uses similar data structure that Smallest-Federated-Wiki uses to create wiki:

### Story, Array, a list of story items.
#### Story item is an editable section in wiki content.

     id: unique string id
     type: name of plugin used for rendering and editing the item
     text: text content of the item

  Story item may have some other attributes designed by the plugin, for example: layout item has a story attribute, which is a list of story items inside the layout.
 
### Journal, Array, a list of actions. Journal is optional.
#### Action data structure:

    id: unique string id, from the item id
    type: 'add', 'edit', 'remove', 'move'
    item: optional, add/edit action has this attribute
    after: an item id, identify the position of the item that action is related.
    inside: a layout item id, identify the position of the item that action is related.
    order: a list of item id that presents order of all of items in a layout after item moved.

Modules
-------------------------------

WikiMate is modularized as jQuery plugins:

### base

some basic util methods including generate id, event replay and deep clone; jQuery plugin helper, some wikimate global variables: events, plugins, version...

### story

Container of story items, also response to add new item and reorder items by drag&drop.

Basic behaviors:

* Double click to create new item
* Move item by drag&drop
* A [+] link at the bottom for adding a new factory item

### story item

An item is rendered & edited by plugin. It responds for maintaining story item data object.

### text editor

A simple textarea editor with handy shortcuts.

Basic behaviors:

* should finish current item editing and create new item with same item type after user typed 2 new line at the end of the item content.
* textarea change event should not conflict with wikimate change event
* auto increase height when user inputs more content
* same height with item content when entering edit
* bind with editor shortcuts
* should not open another editor when click outside of current editing editor
* save link/button

### inline editable

a simple single line text editor. Originally created for inline editing one column layout heading.

### editor shortcuts

Conventionalize text editor's shortcuts:

* Click outside of editing item to save
* Ctrl/Cmd + s to save
* Esc to cancel editing
* Enter to save, optional

### journal

Record actions happened in story, and also show simple diff changes for each action.

### undo

Undo last action in journal

### dropfile

A simple HTML5 drag&drop file jQuery plugin for uploading images/attachments. It only works on Chrome currently.

### Plugins

#### Paragraph

Paragraph is default new item type in story.

* break into p elements for text lines
* double click to edit
* edit by plain text editor

#### Factory

Factory lists all types of items that have title defined in plugin. For example, Factory and Paragraph don't have title, hence there are no Factory and Paragraph link listed in the rendered factory item.

#### Todo

A very simple todo plugin that lists all todos and have checkbox for completing the todo.
Edit by plain text editor

#### RDoc

RDoc is a Rich Document plugin integrating with tinyMCE WYSIWYG editor.

#### One Column Layout

One Column Layout is a layout presents heading and content.

#### Image

A simple image item implementation, that accepts an image url as image item and render the image item as img html element.

#### Unknown

When a unknown type item found in story, the item will be rendered by this plugin





