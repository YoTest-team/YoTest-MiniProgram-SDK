const App = getApp();

Component({
  properties: {
    url: {
      type: String,
      value: "",
    },
  },
  data: {
    loadUrl: "",
  },
  lifetimes: {
    attached() {
      const { url } = this.properties;
      const { __YOTEST__ } = App.globalData || {};
      this.setData({
        loadUrl: `${url}?accessId=${__YOTEST__.accessId}`,
      });
    },
  },
  methods: {
    onMessageHandler({ detail }) {
      App.globalData.__YOTEST__ = {
        ...App.globalData.__YOTEST__,
        data: (detail.data || [])[0],
      };
    },
  },
});
