<template>
  <div 
    :id="id"
    class="grid-content"
    :class="statusClass"
    @click="handleClick"
    @contextmenu.prevent="handleRightClick"
  >
    {{ displayText }}
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    type: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    fileInfo() {
      return this.$parent.fileList.find(item => item.type === this.type);
    },
    statusClass() {
      if (this.required) return 'bg-red';
      if (this.fileInfo) return 'bg-green';
      return 'bg-white';
    },
    displayText() {
      if (this.fileInfo) return this.fileInfo.originalname;
      if (this.required) return this.label;
      return '未上传';
    }
  },
  methods: {
    handleClick() {
      if (this.fileInfo) {
        this.$parent.download_pdf(this.type);
      } else {
        this.$message.warning('没有找到该文件');
      }
    },
    handleRightClick() {
      this.$parent.upload_pdf(this.type);
    }
  }
};
</script>

<style scoped>
.grid-content {
  border-radius: 8px;
  min-height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  color: #34495e;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 65px;
  padding: 15px;
  transition: background-color 0.3s, transform 0.3s;
}

.grid-content:hover {
  transform: scale(1.02);
}

.grid-content.bg-green {
  background-color: #2ecc71;
  color: white;
}

.grid-content.bg-red {
  background-color: #e57063;
  color: white;
}

.grid-content.bg-white {
  background-color: #ecf0f1;
}
</style>