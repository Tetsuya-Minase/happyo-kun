<template>
  <div class="terminal-window" data-node-id="4:19">
    <div class="terminal-header" data-node-id="3:10">
      <div class="terminal-buttons">
        <button
          class="terminal-button close"
          data-node-id="3:13"
          aria-label="Close"
          @click="handleClose"
        />
        <button
          class="terminal-button minimize"
          data-node-id="3:16"
          aria-label="Minimize"
          @click="handleMinimize"
        />
        <button
          class="terminal-button maximize"
          data-node-id="3:17"
          aria-label="Maximize"
          @click="handleMaximize"
        />
      </div>
      <div v-if="title" class="terminal-title">
        {{ title }}
      </div>
    </div>
    <div class="terminal-display" data-node-id="3:8">
      <slot>
        <pre class="terminal-content">{{ defaultContent }}</pre>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  title?: string
  defaultContent?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'DemoTitle',
  defaultContent: '$ Welcome to Terminal\n$ Type your commands here...'
})

const emit = defineEmits<{
  close: []
  minimize: []
  maximize: []
}>()

const handleClose = () => {
  emit('close')
}

const handleMinimize = () => {
  emit('minimize')
}

const handleMaximize = () => {
  emit('maximize')
}
</script>

<style scoped>
.terminal-window {
  display: inline-block;
  min-width: 300px;
  max-width: 100%;
  min-height: 150px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  box-sizing: border-box;
  background: #000000;
}

.terminal-header {
  background: #1c1e20;
  height: 30px;
  min-height: 30px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  position: relative;
  box-sizing: border-box;
}

.terminal-buttons {
  display: flex;
  gap: 8px;
  z-index: 1;
}

.terminal-button {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;
}

.terminal-button:hover {
  opacity: 0.8;
}

.terminal-button.close {
  background: #ff5f56;
}

.terminal-button.minimize {
  background: #ffbd2e;
}

.terminal-button.maximize {
  background: #27c93f;
}

.terminal-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #8b8b8b;
  font-size: 12px;
  font-weight: 500;
  user-select: none;
}

.terminal-display {
  background: #000000;
  min-height: 120px;
  padding: 12px;
  overflow-y: auto;
  color: #00ff00;
  font-size: 12px;
  line-height: 1.5;
  box-sizing: border-box;
}

.terminal-content {
  margin: 0;
  font-family: inherit;
  color: inherit;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* カスタムスクロールバー */
.terminal-display::-webkit-scrollbar {
  width: 8px;
}

.terminal-display::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.terminal-display::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}

.terminal-display::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .terminal-window {
    width: 100%;
    min-width: 250px;
    min-height: 150px;
  }

  .terminal-display {
    min-height: 100px;
  }
}
</style>