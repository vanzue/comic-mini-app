Component({
  data: {
    text: ''
  },
  methods: {
    onBubbleTap(e: { stopPropagation: () => void; }) {
      // 阻止事件传播
      e.stopPropagation();
    },
    onInput(e: { detail: { value: any; }; }) {
      this.setData({
        text: e.detail.value
      });
    }
  }
});
