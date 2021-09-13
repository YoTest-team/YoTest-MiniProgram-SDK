const App = getApp();

function sleep(delay = 100) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
async function request(option, retry = 5) {
  const send = (option) => {
    return new Promise((resolve, reject) => {
      wx.request({
        ...option,
        success: (data) => resolve(data),
        fail: (error) => reject(error),
      });
    });
  };

  for (let i = 0; i < retry; i++) {
    try {
      return await send(option);
    } catch (e) {
      if (i >= retry) throw e;
      else await sleep();
    }
  }
}

Component({
  properties: {
    accessId: {
      type: String,
      value: "",
    },
    pageRoute: {
      type: String,
      value: "",
    },
  },
  data: {
    isInited: false,
  },
  pageLifetimes: {
    show: function () {
      if (!this.data.isInited) {
        this.data.isInited = true;
        return;
      }

      const { __YOTEST__ } = App.globalData || {};

      if (__YOTEST__.data == null) {
        return;
      }

      if ("token" in __YOTEST__.data) {
        this.triggerEvent("success", {
          ...__YOTEST__.data,
        });
      } else if ("code" in __YOTEST__.data) {
        this.triggerEvent("error", {
          ...__YOTEST__.data,
        });
      }
    },
  },
  methods: {
    verify() {
      if (!this.data.isInited) {
        const error = new Error(`[ERROR] yotest isn't inited`);
        this.triggerEvent("error", error);
        console.error(error.message);
        return;
      }

      const { accessId, pageRoute } = this.properties;
      if (!accessId) {
        const error = new Error(`[ERROR] yotest accessId missing`);
        this.triggerEvent("error", error);
        console.error(error.message);
        return;
      }

      if (!pageRoute) {
        const error = new Error(`[ERROR] yotest pageRoute missing`);
        this.triggerEvent("error", error);
        console.error(error.message);
        return;
      }

      App.globalData.__YOTEST__ = {
        accessId,
        data: null,
        ...App.globalData.__YOTEST__,
      };

      wx.navigateTo({
        url: `${pageRoute}?accessId=${accessId}`,
      });
    },
  },
});
