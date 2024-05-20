Component({
  properties: {
    text:{
      type:String,
      value:""
    },
    eventName: {
      type: String,
      value: ""
    },
    metadata: {
      type: String,
      value: ""
    },  
  },
  methods: {
    handleTap: function () {
      this.triggerEvent(this.data.eventName, { value: this.data.metadata });
    }
  }
});
