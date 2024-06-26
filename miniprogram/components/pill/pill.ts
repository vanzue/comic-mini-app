Component({
  properties: {
    content: {
      type: String,
      value: "",
    },
    eventName: {
      type: String,
      value: ""
    },
    metadata: {
      type: String,
      value: ""
    },
    selected: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    handleTap: function () {
      this.triggerEvent(this.data.eventName, { value: this.data.metadata });
    }
  }
});
