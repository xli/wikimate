
describe("Events Replay", function() {
  it("single item add/edit/remove events", function() {
    var events = [{
      id: '1',
      type: 'add',
      item: {id: '1', text: 'hello world'}
    }];

    expect(wikimate.utils.replay(events)).toEqual([
      {id: '1', text: 'hello world'}
    ]);

    events.push({
      id: '1',
      type: 'edit',
      item: {id: '1', text: 'world'}
    });

    expect(wikimate.utils.replay(events)).toEqual([
      {id: '1', text: 'world'}
    ]);

    events.push({
      id: '1',
      type: 'remove'
    });

    expect(wikimate.utils.replay(events)).toEqual([]);
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
      }
    ];

    expect(wikimate.utils.replay(events)).toEqual([
      {id: '2', text: 'again'}, {id: '1', text: 'hello'}
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

    expect(wikimate.utils.replay(events)).toEqual([
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
});
