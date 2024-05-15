Component({
  properties: {
    content: {
      type: String,
      value: ""
    }
  },
  methods: {
    handleTap: function (e: { currentTarget: { dataset: { style: any; }; }; }) {
      this.triggerEvent('pill-tapped', { value: e.currentTarget.dataset.style });
    }
  }
});
