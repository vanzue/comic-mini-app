Component({
  properties: {
    name: {
      type: String,
      value: ""
    },
    url: {
      type: String,
      value: ""
    },
    showName: {
      type: Boolean,
      value: true
    }
  },
  methods: {
    handleTap: function () {
      this.triggerEvent("click-collection", { value: this.data.name });
    }
  }
});
