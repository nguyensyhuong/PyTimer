export default {
    init_page: [
        {
            active: false,
            content: require('../../../../plugins/firebase').default,
            position: 2000
        }
    ],
    actions: [
      {
          active: false,
          content: require('../../../../plugins/firebase/action.js').default,
          position: 2000
      }
    ],
}
