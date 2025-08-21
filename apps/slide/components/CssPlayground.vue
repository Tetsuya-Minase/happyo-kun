<template>
  <div class="css-playground">
    <div class="editor">
      <h3>CSS Editor</h3>
      <textarea 
        v-model="cssCode" 
        @input="onCssChange" 
        placeholder="Enter your CSS here..."
        class="css-textarea"
      />
      <div class="controls">
        <button @click="resetCss" class="btn-reset">リセット</button>
        <button @click="saveCss" class="btn-save" :disabled="saving">
          {{ saving ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>
    <div class="preview">
      <h3>Preview</h3>
      <iframe 
        ref="previewFrame" 
        :srcdoc="previewHtml" 
        class="preview-iframe"
      />
    </div>
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const cssCode = ref(`/* Default CSS */
.demo-box {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: sans-serif;
  font-weight: bold;
  transition: all 0.3s ease;
}

.demo-box:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}`)

const saving = ref(false)
const message = ref('')
const messageType = ref('')

const defaultCss = cssCode.value

const previewHtml = computed(() => `
<!DOCTYPE html>
<html>
<head>
  <style>
    ${cssCode.value}
  </style>
</head>
<body>
  <div class="demo-box">
    Hover me!
  </div>
</body>
</html>
`)

let debounceTimer: NodeJS.Timeout

const onCssChange = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    // CSS change handling - preview updates automatically via computed property
  }, 300)
}

const resetCss = () => {
  cssCode.value = defaultCss
  showMessage('CSS reset to default', 'success')
}

const saveCss = async () => {
  saving.value = true
  try {
    const response = await fetch('/api/css', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        css: cssCode.value,
        timestamp: Date.now()
      })
    })
    
    if (response.ok) {
      showMessage('CSS saved successfully!', 'success')
    } else {
      throw new Error('Failed to save CSS')
    }
  } catch (error) {
    showMessage('Error saving CSS', 'error')
    console.error('Save error:', error)
  } finally {
    saving.value = false
  }
}

const showMessage = (text: string, type: 'success' | 'error') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}
</script>

<style scoped>
.css-playground {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: 400px;
  font-family: sans-serif;
}

.editor, .preview {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: white;
}

.editor h3, .preview h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
}

.css-textarea {
  width: 100%;
  height: 280px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  resize: none;
  outline: none;
}

.css-textarea:focus {
  border-color: #4ecdc4;
  box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.2);
}

.controls {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.btn-reset, .btn-save {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.btn-reset {
  background: #f44336;
  color: white;
}

.btn-reset:hover {
  background: #d32f2f;
}

.btn-save {
  background: #4caf50;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #45a049;
}

.btn-save:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.preview-iframe {
  width: 100%;
  height: 280px;
  border: 1px solid #eee;
  border-radius: 4px;
  background: white;
}

.message {
  grid-column: 1 / -1;
  padding: 8px 12px;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  margin-top: -10px;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .css-playground {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .editor, .preview {
    height: 300px;
  }
  
  .css-textarea, .preview-iframe {
    height: 200px;
  }
}
</style>