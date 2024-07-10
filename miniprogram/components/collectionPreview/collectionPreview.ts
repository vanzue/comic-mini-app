Component({
  properties: {
    name:{
      type:String,
      value:""
    },
    url: {
      type: String,
      value: ""
    },  
  },
  methods: {
    handleTap: function () {
      this.triggerEvent("click-collection", { value: this.data.name });
    }
  }
});
