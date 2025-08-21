<template>
  <div class="api-demo">
    <h3>API Integration Demo</h3>
    <div class="demo-content">
      <div class="input-section">
        <label for="nameInput">名前を入力:</label>
        <input 
          id="nameInput"
          v-model="name" 
          placeholder="例: Slidev" 
          class="name-input"
          @keyup.enter="callApi"
        />
        <button 
          @click="callApi" 
          :disabled="loading"
          class="api-button"
        >
          {{ loading ? '送信中...' : 'API呼び出し' }}
        </button>
      </div>
      
      <div v-if="response" class="response success">
        <h4>✅ API Response:</h4>
        <pre>{{ formattedResponse }}</pre>
      </div>
      
      <div v-if="error" class="response error">
        <h4>❌ Error:</h4>
        <p>{{ error }}</p>
        <button @click="retryApi" class="retry-button">
          🔄 Retry
        </button>
      </div>
      
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>API通信中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const name = ref('World')
const response = ref('')
const error = ref('')
const loading = ref(false)

const formattedResponse = computed(() => {
  if (!response.value) return ''
  try {
    return JSON.stringify(JSON.parse(response.value), null, 2)
  } catch {
    return response.value
  }
})

const callApi = async () => {
  loading.value = true
  error.value = ''
  response.value = ''
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒タイムアウト
    
    const apiResponse = await fetch(`/api/hello?name=${encodeURIComponent(name.value)}`, {
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!apiResponse.ok) {
      throw new Error(`HTTP ${apiResponse.status}: ${apiResponse.statusText}`)
    }
    
    const data = await apiResponse.text()
    response.value = data
    
    // レスポンスをJSONとしてパースして表示
    try {
      const jsonData = JSON.parse(data)
      console.log('API Response:', jsonData)
    } catch {
      // JSONでない場合はそのまま表示
      console.log('API Response (text):', data)
    }
    
  } catch (err: any) {
    if (err.name === 'AbortError') {
      error.value = 'API request timed out (5 seconds). Please try again.'
    } else if (err.message.includes('Failed to fetch')) {
      error.value = 'Network error. Please check your connection and try again.'
    } else {
      error.value = `Error: ${err.message}`
    }
    console.error('API Error:', err)
  } finally {
    loading.value = false
  }
}

const retryApi = () => {
  callApi()
}

// 初期実行（デモ用）
// onMounted(() => {
//   setTimeout(() => callApi(), 1000)
// })
</script>

<style scoped>
.api-demo {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.api-demo h3 {
  margin: 0 0 20px 0;
  color: #333;
  text-align: center;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.input-section label {
  font-weight: bold;
  color: #555;
}

.name-input {
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  width: 200px;
  text-align: center;
  outline: none;
  transition: border-color 0.2s;
}

.name-input:focus {
  border-color: #4ecdc4;
  box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.2);
}

.api-button {
  padding: 10px 20px;
  background: #4ecdc4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.2s;
  min-width: 120px;
}

.api-button:hover:not(:disabled) {
  background: #45b7aa;
}

.api-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.response {
  padding: 16px;
  border-radius: 4px;
  margin-top: 10px;
}

.response.success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.response.error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.response h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.response pre {
  background: rgba(0,0,0,0.05);
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  margin: 0;
  white-space: pre-wrap;
}

.retry-button {
  margin-top: 8px;
  padding: 6px 12px;
  background: #ffc107;
  color: #212529;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.retry-button:hover {
  background: #e0a800;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  color: #666;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4ecdc4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .api-demo {
    padding: 16px;
    margin: 0 10px;
  }
  
  .name-input {
    width: 100%;
    max-width: 250px;
  }
}
</style>