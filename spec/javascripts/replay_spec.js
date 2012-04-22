
describe("Events Replay", function() {
  it("single item add/edit/remove events", function() {
    var events = [{
      id: '1',
      type: 'add',
      item: {id: '1', text: 'hello world'}
    }];

    expect(_.toArray(wikimate.utils.replay(events))).toEqual([
      {id: '1', text: 'hello world'}
    ]);

    events.push({
      id: '1',
      type: 'edit',
      item: {id: '1', text: 'world'}
    });

    expect(_.toArray(wikimate.utils.replay(events))).toEqual([
      {id: '1', text: 'world'}
    ]);

    events.push({
      id: '1',
      type: 'remove'
    });

    expect(_.toArray(wikimate.utils.replay(events))).toEqual([]);
  });

  it("move item events", function() {
    var events = [{
        id: '1',
        type: 'add',
        item: {id: '1', text: 'hello'}
      },
      {
        id: '2',
        type: 'add',
        item: {id: '2', text: 'again'}
      },
      {
        id: '2',
        type: 'move',
        order: ['2', '1']
      },
      {
        id: '2',
        type: 'edit',
        item: {id: '2', text: 'world'}
      }
    ];

    expect(_.toArray(wikimate.utils.replay(events))).toEqual([
      {id: '2', text: 'world'}, {id: '1', text: 'hello'}
    ]);
  });

  it("insert item", function() {
    var events = [{
        id: '1',
        type: 'add',
        item: {id: '1', text: 'hello'}
      },
      {
        id: '2',
        type: 'add',
        item: {id: '2', text: 'again'}
      },
      {
        id: '3',
        type: 'add',
        item: {id: '3', text: '!'},
        after: '1'
      }
    ];

    expect(_.toArray(wikimate.utils.replay(events))).toEqual([
      {id: '1', text: 'hello'}, {id: '3', text: '!'}, {id: '2', text: 'again'}
    ]);
  });

  it("should have side effects to events objects", function() {
    var events = [
      {
        id: '1',
        type: 'add',
        item: {id: '1', text: 'hello world'}
      },
      {
        id: '1',
        type: 'edit',
        item: {id: '1', text: 'world'}
      }
    ];
    wikimate.utils.replay(events);
    expect(events).toEqual([
      {
        id: '1',
        type: 'add',
        item: {id: '1', text: 'hello world'}
      },
      {
        id: '1',
        type: 'edit',
        item: {id: '1', text: 'world'}
      }
    ]);
  });

  it("find item by id", function() {
    var events = [
      {
        id: '1',
        type: 'add',
        item: {id: '1', text: 'hello world'}
      },
      {
        id: '1',
        type: 'edit',
        item: {id: '1', text: 'world'}
      }
    ];
    var story = wikimate.utils.replay(events);
    expect(story.itemById('1').text).toEqual("world");
    expect(story.itemIndexById('1')).toEqual(0);

    expect([].item).toBeUndefined();
    expect([]['item']).toBeUndefined();
    expect([].itemIndex).toBeUndefined();
  });
});
