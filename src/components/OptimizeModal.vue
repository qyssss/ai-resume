<template>
    <el-dialog v-model="dialogVisible" title="AI Optimization Preview" width="80%" :before-close="handleClose"
        top="5vh">
        <div class="diff-container p-4 bg-gray-900 rounded-lg">
            <el-alert title="Review the changes below. Accept to update your resume, or cancel to discard." type="info"
                :closable="false" class="mb-4" />
            <div class="grid grid-cols-2 gap-6">
                <div>
                    <h3 class="text-lg font-semibold mb-2 text-gray-300">Original Version</h3>
                    <pre class="diff-content">{{ originalResume }}</pre>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2 text-green-400">Optimized Version</h3>
                    <pre class="diff-content">{{ optimizedResume }}</pre>
                </div>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">Cancel</el-button>
                <el-button type="primary" @click="handleAccept">
                    Accept & Update
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    modelValue: Boolean, // For v-model binding
    original: {
        type: Object,
        required: true,
    },
    optimized: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue', 'accept']);

const dialogVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

// Pretty-print JSON for display
const originalResume = computed(() => JSON.stringify(props.original, null, 2));
const optimizedResume = computed(() => JSON.stringify(props.optimized, null, 2));

const handleClose = () => {
    dialogVisible.value = false;
};

const handleAccept = () => {
    emit('accept', props.optimized);
    handleClose();
};
</script>

<style scoped>
.diff-container {
    height: 70vh;
    overflow-y: auto;
}

.diff-content {
    background-color: #111827;
    padding: 1rem;
    border-radius: 0.5rem;
    color: #d1d5db;
    white-space: pre-wrap;
    word-break: break-all;
    font-family: 'Courier New', Courier, monospace;
}
</style>