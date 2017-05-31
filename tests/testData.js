module.exports = {

  formatEvents: [
    // test 1
    {
      input: [
        {title: 'test me', date: '2011-03-03'}
      ],
      expectedOutput: [
        {
          date: '2011-03-03',
          events: [
            {title: 'test me', date: '2011-03-03'}
          ]
        }
      ],
      message: 'should return correct result for list of one event.'
    },
    // test 2
    {
      input: [
        {title: 'test me', date: '2011-03-03'},
        {title: 'test me too', date: '2011-03-03'},
        {title: 'test me again', date: '2011-03-03'}
      ],
      expectedOutput: [
        {
          date: '2011-03-03',
          events: [
            {title: 'test me', date: '2011-03-03'},
            {title: 'test me too', date: '2011-03-03'},
            {title: 'test me again', date: '2011-03-03'}
          ]
        }
      ],
      message: 'should return correct result for 3 events on one date.'
    },
    // test 3
    {
      input: [
        {title: 'test me', date: '2011-03-03'},
        {title: 'test me again', date: '2011-04-03'},
        {title: 'test me thrice', date: '2011-04-03'}
      ],
      expectedOutput: [
        {
          date: '2011-03-03',
          events: [
            {title: 'test me', date: '2011-03-03'}
          ]
        },
        {
          date: '2011-04-03',
          events: [
            {title: 'test me again', date: '2011-04-03'},
            {title: 'test me thrice', date: '2011-04-03'}
          ]
        }
      ],
      message: 'should return correct result for events on consecutive dates.'
    },
    // test 4
    {
      input: [
        {title: 'test me', date: '2011-06-03'},
        {title: 'test me again', date: '2011-04-03'},
        {title: 'test me thrice', date: '2011-04-03'}
      ],
      expectedOutput: [
        {
          date: '2011-04-03',
          events: [
            {title: 'test me again', date: '2011-04-03'},
            {title: 'test me thrice', date: '2011-04-03'}
          ]
        },
        {
          date: '2011-06-03',
          events: [
            {title: 'test me', date: '2011-06-03'}
          ]
        }
      ],
      message: 'should return correct result for unordered events.'
    }
  ]

}
